export type CountCategory = {
    "path": string,
    "count": number,
}
export type ImageCount = {
    [key: string]: {
        [key:string ] : CountCategory
    }

}
export type ApiData = ImageCount[]
