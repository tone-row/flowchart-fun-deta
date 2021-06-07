import { t } from "@lingui/macro";
import { Dispatch, useContext, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";
import { getFlowchart } from "./api";
import { AppContext } from "./components/AppContext";

export function useAnimationSetting() {
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const animation = query.get("animation");
  return animation === "0" ? false : true;
}

export function useDefaultText() {
  const defaultText = `${t`This app works by typing`}
  ${t`Indenting creates a link to the current line`}
  ${t`any text: before a colon creates a label`}
  ${t`Create a link directly using the exact label text`}
    ${t`like this: (This app works by typing)`}
    ${t`[custom ID] or`}
      ${t`by adding an [ID] and referencing that`}
        ${t`like this: (custom ID) // You can also use single-line comments`}
/*
${t`or`}
${t`multiline`}
${t`comments`}

${t`Have fun! 🎉`}
*/`;
  return defaultText;
}

export function useText() {
  const { workspace } = useContext(AppContext);
  const [text, setText] = useState<string>("");
  const { data } = useQuery(["flowchart", workspace], getFlowchart, {
    enabled: !!workspace,
    onSuccess: (result) => {
      if (result.text) {
        setText(result.text);
      }
    },
  });

  const isReady = !!data;

  // debounce update

  // const [text, setText] = useLocalStorage(
  //   ["flowcharts.fun", workspace].filter(Boolean).join(":"),
  //   defaultText
  // );

  return { text, setText, isReady };
}
