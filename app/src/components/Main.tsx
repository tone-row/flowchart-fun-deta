import React, {
  ReactNode,
  Dispatch,
  SetStateAction,
  memo,
  useState,
  useCallback,
  useContext,
} from "react";
import Graph from "./Graph";
import { GraphContext } from "./GraphProvider";
import GraphWrapper from "./GraphWrapper";
import TabPane from "./TabPane";
import TextResizer from "./TextResizer";

export type MainProps = {
  children?: ReactNode;
  textToParse: string;
  setHoverLineNumber: Dispatch<SetStateAction<number | undefined>>;
};

const Main = memo(
  ({ children, textToParse, setHoverLineNumber }: MainProps) => {
    const [shouldResize, triggerResize] = useState(0);
    const trigger = useCallback(() => triggerResize((n) => n + 1), []);
    const { isReady } = useContext(GraphContext);
    return (
      <>
        <TabPane triggerResize={trigger}>{children}</TabPane>
        <GraphWrapper>
          {isReady ? (
            <Graph
              textToParse={textToParse}
              setHoverLineNumber={setHoverLineNumber}
              shouldResize={shouldResize}
            />
          ) : (
            <div>Select a Graph</div>
          )}
        </GraphWrapper>
        <TextResizer />
      </>
    );
  }
);

Main.displayName = "Main";

export default Main;
