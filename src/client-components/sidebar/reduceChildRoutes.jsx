import React from "react";
import { matchPath } from "react-router-dom";

import SidebarNavListItem from "./SidebarNavListItem";
import SidebarNavList from "./SidebarNavList";

const reduceChildRoutes = (props) => {
  const { items, page, depth, currentRoute } = props;

  if (page.children) {
    const open = page.href
      ? !!matchPath(
          {
            path: page.href,
            end: false,
          },
          currentRoute
        )
      : false;

    items.push(
      <SidebarNavListItem
        page={page}
        depth={depth}
        icon={page.icon}
        activeIcon={page.activeIcon}
        key={page.title}
        badge={page.badge}
        open={!!open}
        title={page.title}
        href={page.href}
      >
        <SidebarNavList depth={depth + 1} pages={page.children} />
      </SidebarNavListItem>
    );
  } else {
    items.push(
      <SidebarNavListItem
        depth={depth}
        page={page}
        href={page.href}
        icon={page.icon}
        activeIcon={page.activeIcon}
        key={page.title}
        badge={page.badge}
        title={page.title}
        currentRoute={currentRoute}
      />
    );
  }

  return items;
};

export default reduceChildRoutes;
