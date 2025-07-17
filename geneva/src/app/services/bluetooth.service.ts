/// <reference types="web-bluetooth" />

import { Injectable } from '@angular/core'
import { ToolCharacteristic, ToolDefinition, ToolField, ToolInformation, ToolService } from '../models/tool-definition.model'

interface RegisteredTool {
  info: ToolInformation
  device: BluetoothDevice
  services: BluetoothRemoteGATTService[]
  characteristics: {
    [uuid:string]: RegisteredToolCharacteristic
  }
  fields: {
    [id:string]: RegisteredToolField
  }
}

interface RegisteredToolCharacteristic {
  definition: ToolCharacteristic
  raw: BluetoothRemoteGATTCharacteristic 
}

interface RegisteredToolField {
  definition: ToolField
  characteristic: string
  decoded?: any
  mapped?: any
}

interface ToolRegister {
  [id:string]: RegisteredTool
}


@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  toolRegister:ToolRegister = {}

  async requestTool(definition: ToolDefinition) {

    let services:string[] = []
    let optionalServices:string[] = []

    definition.bluetooth.services.forEach(service => {
      
      if (service.isPrimary) {
        services.push(service.uuid)
      } else {
        optionalServices.push(service.uuid)
      }

    })

    const options = {
      filters: [{services}],
      optionalServices
    }

    navigator.bluetooth.requestDevice(options)
      .then(device => {
        this.registerTool(device,definition)
        this.connectToServer(device, definition)
        
      })
      .catch(error => {
        console.error("Device Pair Request Failed")
        console.log(error)
      })

  }

  /*

    Step 2
    ------

    Device is now paired, the GATT server can be connected to

  */


  connectToServer(device:BluetoothDevice, definition: ToolDefinition) {
    
    console.log("Device Paired, connecting to server...", device)

    device.gatt?.connect()
      .then(server => {
        this.getServices(server, definition)
      })
      .catch(error => {
        console.error("Device Server Connection Failed")
        console.log(error)
      })

  }

  /*

    Step 3
    ------

    Device GATT server is now connected, services can be retrieved

  */

  getServices(server: BluetoothRemoteGATTServer, definition: ToolDefinition) {
    console.log("Device Server Connected", server)

    // Get the registered tool to load the services
    const rd = this.getToolWithDevice(server.device)
    
    definition.bluetooth.services.forEach(serviceDef => {

      server.getPrimaryService(serviceDef.uuid)
        .then(service => {
          this.addService(service)
          this.getCharacteristics(service,serviceDef)
        })
        .catch(error => {
          console.error(error)
          console.log("Unable to get service", serviceDef)
        })

    })

  }

  /*

    Step 4
    ------

    Service acquired, characteristics can be loaded now

  */

  getCharacteristics(service: BluetoothRemoteGATTService, definition: ToolService) {

    definition.characteristics.forEach(charDef => {

      service.getCharacteristic(charDef.uuid)
        .then(characteristic => {
          this.addCharacteristic(characteristic, charDef)
          this.setupCharacteristic(characteristic)
        })
        .catch(error => {
          console.error(error)
        })

    })

  }

  setupCharacteristic(characteristic: BluetoothRemoteGATTCharacteristic) {

    let p = characteristic.properties

    if (p.read || p.notify) {
      // Listen for any resolved read requests
      characteristic.addEventListener('characteristicvaluechanged', event => {
        this.handleCharacteristicNotification(event)
      })
      // Perform initial read
      characteristic.readValue()
        .catch(error => {
          console.error("Intial Read Failed", characteristic, error)
        })
    }
    
    if (p.notify) {
      // Register to start receiving notifications
      characteristic.startNotifications()
    }

  }

  handleCharacteristicNotification(event:Event) {

    // take the raw data and format into each field for the characteristic

    const characteristic = event.target as BluetoothRemoteGATTCharacteristic
    const rt = this.getToolWithDevice(characteristic.service.device)

    const rtc: RegisteredToolCharacteristic = rt.characteristics[characteristic.uuid]

    if (rtc == undefined) {
      console.warn("Unable to find stored characteristic", characteristic)
      return
    }

    rtc.definition.packet_format.fields.forEach(fieldDef => {
      const decoded = this.decodePacketForField(characteristic.value!,fieldDef)
      rt.fields[fieldDef.id].decoded = decoded
    })
    
  }


  /*


    Decode Helper
    -------------


  */

  

  /*


    DataView to 32Bit Bit Field
    ---------------------------

    Take a DataView and extract a bit-aligned bit field from
    it to make a 32bit unsigned number.
    

  */

  extractBitfield(dataView: DataView, bitOffset: number, bitLength: number): number {

    let result = 0

    for (let i = 0; i < bitLength; i++) {

      // Absolute bit index within the dataView
      const absBit = bitOffset + i

      // Current byte index we are reading from
      const byteIndex = Math.floor(absBit / 8)

      // Bit index within the byte
      const bitInByte = absBit % 8

      // The byte to read from the dataView
      const byte = dataView.getUint8(byteIndex)

      // Shift the byte to the right so bitInByte is at pos 0
      // and mask all other bits except LSB
      const bit = (byte >> bitInByte) & 1

      // Append to result
      result |= bit << i // Little-endian bit order

    }

    // Convert to 32Bit Unsigned Number 
    // using 'unsigned right shift'
    return result >>> 0

  }

  /*


    Bit Field to DataView
    ---------------------

    Take an extracted bit field and repack into a DataView so it's
    standard functions can be used.


  */

  repackToDataView(raw: number, totalBits: number): DataView {

    // Calculate byte length based on number of bits
    const byteLength = Math.ceil(totalBits / 8)

    // Create new DataView to store the bits
    const buffer = new ArrayBuffer(byteLength)
    const dataView = new DataView(buffer)

    // Insert bits into each byte of the dataView
    for (let i = 0; i < byteLength; i++) {
      // Little-endian Byte Order
      dataView.setUint8(i, (raw >> (i * 8)) & 0xFF)
    }

    return dataView

  }



  utf8 = new TextDecoder('utf-8')

  decodePacketForField(dataView: DataView, definition: ToolField): any {
    
    let { id, offset, length, type, scale } = definition

    let value: any;
    const isByteAligned = offset % 8 === 0 && length % 8 === 0
    let byteOffset = offset / 8

    try {

      // Handle String Values

      if (type === 'utf8') {
        
        if (!isByteAligned) {
          throw new Error(`UTF8 field '${id}' must be byte aligned`)
        }

        let byteLength = length / 8

        if (byteLength === 0) {
          // Use all the entire dataView
          byteLength = dataView.byteLength
        }

        const bytes = new Uint8Array(dataView.buffer, dataView.byteOffset + byteOffset, byteLength)
        return this.utf8.decode(bytes).replace(/\0+$/, ''); // trim trailing nulls

      }

      // Handle number values

      if (!isByteAligned) {
        // Extract and repack bit field to be byte aligned
        const raw = this.extractBitfield(dataView, offset, length)
        dataView = this.repackToDataView(raw, length)
        byteOffset = 0
      }

      switch (type) {
        case 'int8': value = dataView.getInt8(byteOffset)
          break
        case 'uint8': value = dataView.getUint8(byteOffset)
          break
        case 'int16': value = dataView.getInt16(byteOffset, true)
          break
        case 'uint16': value = dataView.getUint16(byteOffset, true)
          break
        case 'int32': value = dataView.getInt32(byteOffset, true)
          break
        case 'uint32': value = dataView.getUint32(byteOffset, true)
          break
        case 'float32': value = dataView.getFloat32(byteOffset, true)
          break
        case 'float64': value = dataView.getFloat64(byteOffset, true)
          break
        default: throw new Error(`Unsupported type: ${type}`)
      }

      // Set the scale
      if (scale != null && typeof value === 'number') {
        value *= scale
      }

      // Do the mapping
      // if (map && value in map) value = map[value];
      return value

    }
    catch (error) {
      throw new Error(`Error decoding field '${id}': ${error}`)
    }
  }

  /*

    Register Helper
    ---------------

    Get the RegistredTool for the bluetooth device id

  */

  getToolWithDevice(device:BluetoothDevice) {

    // What to do if not found?
    const tool = this.toolRegister[device.id]
    return tool

  }

  registerTool(device: BluetoothDevice, definition: ToolDefinition) {

    const rt: RegisteredTool = {
      info: definition.info,
      device,
      services: [],
      characteristics: {},
      fields: {}
    }

    this.toolRegister[device.id] = rt
  }

  addService(service: BluetoothRemoteGATTService) {
    const rd = this.getToolWithDevice(service.device)
    // Store the default bluetooth service
    // for later reference. May not be needed.
    rd?.services.push(service)
  }

  addCharacteristic(characteristic: BluetoothRemoteGATTCharacteristic, definition: ToolCharacteristic) {
    
    const rt = this.getToolWithDevice(characteristic.service.device)

    const rtc:RegisteredToolCharacteristic = {
      definition,
      raw: characteristic
    }

    // Add characteristic to stored tool
    rt.characteristics[characteristic.uuid] = rtc

    // Add the fields for the characteristic to the stored tool
    this.addFieldsForDefinition(definition, rt)

  }

  addFieldsForDefinition(definition: ToolCharacteristic, tool: RegisteredTool) {

    definition.packet_format.fields.forEach(fieldDef => {

      const field:RegisteredToolField = {
        definition: fieldDef,
        characteristic: definition.uuid
      }

      tool.fields[fieldDef.id] = field

    })

  }

}
