export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_KEY = "kthok:theme";

export const THEME_SCRIPT = `(function(){try{var t=JSON.parse(localStorage.getItem("${THEME_KEY}"));if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
