import { QueryClient, QueryFunction, QueryFunctionContext } from "react-query";

const API = process.env.REACT_APP_API ?? "/api/";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
    },
  },
});

type Flowchart = {
  key: string;
  created: string;
  updated: string;
  title: string;
  text: string;
};

export async function getFlowcharts() {
  let flowcharts = await (
    (await (
      await fetch(API + "flowcharts", {
        method: "GET",
        redirect: "follow",
      })
    ).json()) as { value: Flowchart[] }
  ).value;

  flowcharts = flowcharts.filter((flowchart) => "title" in flowchart);

  return flowcharts;
}

export async function createFlowchart(data: { title: string; text: string }) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  const date = new Date().toISOString();

  const flowchart: Omit<Flowchart, "key"> = {
    ...data,
    created: date,
    updated: date,
  };

  console.log({ flowchart });

  const result = await fetch(API + "flowcharts", {
    method: "POST",
    headers,
    body: JSON.stringify(flowchart),
    redirect: "follow",
  });

  return result;
}

export const getFlowchart: QueryFunction<Flowchart, (string | null)[]> =
  async ({ queryKey }) => {
    const [_, key] = queryKey;
    if (!key) throw new Error("Missing Key");
    return (
      await fetch(API + "flowcharts/" + key)
    ).json() as unknown as Flowchart;
  };
