/*

    ToolIndex
    --------

    YAML file returned when calling the index file from tools.rctngl.au

    https://tools.rctngl.au/index.yaml

*/

export interface ToolDefinitionIndex {
    official: ToolDefinitionHeader[]
    unofficial: ToolDefinitionHeader[]
    contributed: ToolDefinitionHeader[]
}

export interface ToolDefinitionHeader {
    path: string
}