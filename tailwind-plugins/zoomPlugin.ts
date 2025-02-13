import plugin from "tailwindcss/plugin";
import type { PluginAPI } from "tailwindcss/types/config";

export default plugin(({ addVariant }: PluginAPI) => {
  addVariant("zoom", ({ container }) => {
    container.walkRules((rule) => {
      rule.selector = `.zoom\\:${rule.selector.slice(1)}`;
      rule.walkDecls((decl) => {
        decl.important = true;
      });
    });
  });
  addVariant("zoom-80", ({ container }) => {
    container.walkRules((rule) => {
      rule.selector = `.zoom-80\\:${rule.selector.slice(1)}`;
      rule.walkDecls((decl) => {
        decl.important = true;
      });
    });
  });
  addVariant("zoom-70", ({ container }) => {
    container.walkRules((rule) => {
      rule.selector = `.zoom-70\\:${rule.selector.slice(1)}`;
      rule.walkDecls((decl) => {
        decl.important = true;
      });
    });
  });
});
