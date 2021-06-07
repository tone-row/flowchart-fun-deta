import Router from "./components/Router";
import * as Sentry from "@sentry/react";
import React, { Suspense } from "react";
import Provider from "./components/AppContext";
import { Box, Type } from "./slang";
import { I18n } from "./locales/i18n";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./api";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Sentry.ErrorBoundary fallback={ErrorFallback}>
          <I18n>
            <Suspense fallback={null}>
              <Router />
            </Suspense>
          </I18n>
        </Sentry.ErrorBoundary>
      </Provider>
    </QueryClientProvider>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="errorWrapper">
      <Box role="alert" className="error-wrapper">
        <Type>Sorry! Something went wrong. 😔</Type>
        <div className="errorMessage">
          <pre>{error.message}</pre>
        </div>
        <button onClick={() => window.location.reload()}>Try again</button>
      </Box>
    </div>
  );
}
