/*

    ToolDefinition
    --------------

    The standard way to define a tool, how to connect and read the 
    data from it. Stored in a YAML file returned with the `tools` api service

*/


export interface ToolDefinition {
    info: ToolInformation
    bluetooth: ToolBluetooth
}

export interface ToolInformation {
    name: string
    version: number
    date: string
    maintainer: string
}

/*

    Bluetooth LE Connectivity

*/

export interface ToolBluetooth {
    services: ToolService[]
}

export interface ToolService {
    uuid: string
    name: string
    isPrimary?: boolean // Used for device searching
    characteristics: ToolCharacteristic[]
}

export interface ToolCharacteristic {
    uuid: string
    name: string
    properties: {
        read?: boolean;
        write?: boolean;
        notify?: boolean;
    }
    packet_format: {
        fields: ToolCharacteristicField[]
    }
}

export interface ToolCharacteristicField {
    
    name: string

    offset: number
    length: number
    type: FieldType

    // scale?: number
    // map?: Record<number | string, any>
    // display?: {}

}

export type FieldType =
  | 'uint8'
  | 'int8'
  | 'uint16'
  | 'int16'
  | 'uint32'
  | 'int32'
  | 'float32'
  | 'float64'
  | 'utf8'