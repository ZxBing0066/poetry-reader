/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'jinrishici' {
    interface Res {
        status: 'success' | 'error';
        data: {
            id: string;
            content: string;
            popularity: number;
            origin: {
                title: string;
                dynasty: string;
                author: string;
                content: string[];
            };
            matchTags: string[];
            recommendedReason: string;
        };
        token: string;
        ipAddress: string;
        warning: null;
    }

    interface LoadHandler {
        (poetry: Res): void;
    }
    interface Load {
        (handler: LoadHandler): void;
    }
    export const load: Load;
    export { Res };
}
