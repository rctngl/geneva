import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { firstValueFrom, BehaviorSubject } from "rxjs"
import * as yaml from 'js-yaml'

import { environment } from "../../environments/environment"
import { ToolDefinitionIndex, ToolDefinitionHeader } from "../models/tool-index.model"
import { ToolDefinition } from "../models/tool-definition.model"

@Injectable({
    providedIn: 'root'
})
export class ToolDefinitionLoaderService {

    // API Changes if running locally
    private readonly TOOL_API = environment.toolApiUrl
    private http = inject(HttpClient)

    // Subjects
    private unofficialSubject = new BehaviorSubject<ToolDefinition[]>([])
    private officialSubject = new BehaviorSubject<ToolDefinition[]>([])
    private contributedSubject = new BehaviorSubject<ToolDefinition[]>([])
    private loadedSubject = new BehaviorSubject<Boolean>(false)
    private dateSubject = new BehaviorSubject<Date>(new Date())

    // Definitions
    public unofficial$ = this.unofficialSubject.asObservable()
    public official$ = this.officialSubject.asObservable()
    public contributed$ = this.contributedSubject.asObservable()
    

    // Status
    public loaded$ = this.loadedSubject.asObservable()
    public lastLoaded$ = this.dateSubject.asObservable()

    /*

        Service Setup
        -------------

    */

    public async loadToolDefinitions() {

        try {

            // Load Definition Index
            const index = await this.loadToolDefinitionIndex()
            console.log('Loaded Tool Definition Index')

            // Load Official Definitions
            if (index.official) {
                console.log(`Official Definitions: ${index.official.length}`)
                const definitions = await this.loadDefinitionsForHeaders('official', index.official)
                this.officialSubject.next(definitions)
            }

            // Load Unofficial Definitions
            if (index.unofficial) {
                console.log(`Unofficial Definitions: ${index.unofficial.length}`)
                const definitions = await this.loadDefinitionsForHeaders('unofficial', index.unofficial)
                this.unofficialSubject.next(definitions)
            }

            // Load Contributed Definitions
            if (index.contributed) {
                console.log(`Contributed Definitions: ${index.contributed.length}`)
                const definitions = await this.loadDefinitionsForHeaders('contributed', index.contributed)
                this.contributedSubject.next(definitions)
            }

            // Update status
            this.loadedSubject.next(true)
            this.dateSubject.next(new Date())

        }
        catch (error) {
            // If offline etc...
            console.warn("Error occured")
            console.log(true)
        }

    }

    /*

        Load the list of available tools from the tools service

    */

    private async loadToolDefinitionIndex(): Promise<ToolDefinitionIndex> {

        const url = `${this.TOOL_API}/index.yaml`

        try {
            const raw = await firstValueFrom(this.http.get(url, {responseType: 'text'}))
            const data = yaml.load(raw) as ToolDefinitionIndex
            return data
        }
        catch(error) {
            console.log("Error loading or parsing tool list YAML:", error)
            throw error;
        }
    }

    /*

        Load the definitions for each header at path (/official, /unofficial etc)

    */

    private async loadDefinitionsForHeaders(path: string, headers: ToolDefinitionHeader[]) {

        const definitions: ToolDefinition[] = []

        headers.forEach(async header => {
            const definition = await this.loadToolDefinition(path,header)
            definitions.push(definition)
        })

        return definitions

    }

    /*

        Load the tool definition from the tools service

    */

    private async loadToolDefinition(path: string, header: ToolDefinitionHeader): Promise<ToolDefinition> {

        const url = `${this.TOOL_API}/${path}/${header.path}`

        try {
            const raw = await firstValueFrom(this.http.get(url, {responseType: 'text'}))
            const data = yaml.load(raw) as ToolDefinition
            return data
        }
        catch (error) {
            console.log("Error loading Tool Definition for url:", url)
            throw(error)
        }

    }

}