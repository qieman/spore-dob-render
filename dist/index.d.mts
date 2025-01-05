interface DobDecodeResponse {
    jsonrpc: string;
    result: string;
    id: number;
}
interface DobDecodeResult {
    dob_content: {
        dna: string;
        block_number: number;
        cell_id: number;
        id: string;
    };
    render_output: RenderOutput[] | string;
}
interface RenderOutput {
    name: string;
    traits: {
        String?: string;
        Number?: number;
    }[];
}

declare enum ParsedStyleFormat {
    Bold = "bold",
    Italic = "italic",
    Strikethrough = "strikethrough",
    Underline = "underline"
}
declare enum ParsedStyleAlignment {
    Left = "left",
    Center = "center",
    Right = "right"
}
interface ParsedStyle {
    color: string;
    format: ParsedStyleFormat[];
    alignment: ParsedStyleAlignment;
    breakLine: number;
}

interface ParsedTrait {
    name: string;
    value: number | string;
}
declare function traitsParser(items: RenderOutput[]): {
    traits: ParsedTrait[];
    indexVarRegister: Record<string, number>;
};

declare const DEFAULT_TEMPLATE = "%k: %v";
declare function renderTextParamsParser(traits: ParsedTrait[], indexVarRegister: Record<string, number>, options?: {
    defaultTemplate?: string;
}): {
    items: {
        name: string;
        value: string | number;
        parsedStyle: ParsedStyle;
        template: string;
        text: string;
        style: {
            textAlign?: string;
            color?: string;
            fontWeight?: string;
            fontStyle?: string;
            textDecoration?: string;
        };
    }[];
    bgColor: string;
};

interface RenderProps extends ReturnType<typeof renderTextParamsParser> {
    font?: {
        regular: ArrayBuffer;
        italic: ArrayBuffer;
        bold: ArrayBuffer;
        boldItalic: ArrayBuffer;
    };
}
declare function renderTextSvg(props: RenderProps): Promise<string>;

declare function renderByDobDecodeResponse(dob0Data: DobDecodeResult | string, props?: Pick<RenderProps, 'font'> & {
    outputType?: 'svg';
}): Promise<string>;

declare function svgToBase64(svgCode: string): Promise<string>;

declare function renderImageSvg(traits: ParsedTrait[]): Promise<string>;

declare function renderByTokenKey(tokenKey: string, options?: Pick<RenderProps, 'font'> & {
    outputType?: 'svg';
}): Promise<string>;

interface BtcFsResult {
    content: string;
    content_type: string;
}
type BtcFsURI = `btcfs://${string}`;
type QueryBtcFsFn = (uri: BtcFsURI) => Promise<BtcFsResult>;
declare class Config {
    private _dobDecodeServerURL;
    private _queryBtcFsFn;
    get dobDecodeServerURL(): string;
    setDobDecodeServerURL(dobDecodeServerURL: string): void;
    setQueryBtcFsFn(fn: QueryBtcFsFn): void;
    get queryBtcFsFn(): QueryBtcFsFn;
}
declare const config: Config;

export { DEFAULT_TEMPLATE, type DobDecodeResponse, type DobDecodeResult, type ParsedTrait, type RenderOutput, type RenderProps, config, renderByDobDecodeResponse, renderByTokenKey, renderImageSvg, renderTextParamsParser, renderTextSvg, svgToBase64, traitsParser };
