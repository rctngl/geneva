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
}