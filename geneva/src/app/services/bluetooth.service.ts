/// <reference types="web-bluetooth" />

import { Injectable } from '@angular/core'
import { ToolDefinition } from '../models/tool-definition.model'

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor() {

  }

  async requestTool(definition: ToolDefinition) {

    console.log(definition)

    let services:string[] = []

    definition.bluetooth.services.forEach(service => {
      
      if (service.isPrimary) {
        services.push(service.uuid)
      }

    })

    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: services }
      ]
    })

    // We now have paired device

    // Attempt to connect
    try {
      const server = await device.gatt?.connect()
      console.log("Connected")
      console.log(server)
    } catch(e) {
      console.log("unable to connect")
    }

  }

}
