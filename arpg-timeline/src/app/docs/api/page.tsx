"use client";

import "swagger-ui-react/swagger-ui.css";
import "@/app/docs/api/swagger-dark.css";

import { useHasMounted } from "@react-hooks-library/core";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
    ssr: false,
    loading: () => (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading API Documentation...</p>
            </div>
        </div>
    ),
});

export default function ApiDocsIframePage() {
    const hasMounted = useHasMounted();

    if (!hasMounted) {
        return null;
    }

    return (
        <div className="swagger-ui-wrapper h-full">
            <Suspense
                fallback={
                    <div className="flex min-h-96 items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                            <p className="text-gray-600">Loading Swagger UI...</p>
                        </div>
                    </div>
                }
            >
                <SwaggerUI
                    url="/api/v1/openapi.json"
                    docExpansion="list"
                    defaultModelsExpandDepth={2}
                    defaultModelExpandDepth={2}
                    displayRequestDuration={false}
                    tryItOutEnabled={false}
                />
            </Suspense>
        </div>
    );
}
