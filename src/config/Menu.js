export default function menu() {
  return [
    {
      name: "article",
      display_name: "Article",
      icon: "ri-file-list-3-line",
      route: "",
      route_name_prefix: "article",
      caret: true,
      childs: [
        {
          name: "article.articles",
          display_name: "Articles",
          icon: null,
          route: "article.articles",
          route_name_prefix: "article.articles",
          caret: false,
        },
        {
          name: "article.calendar",
          display_name: "Calendars",
          icon: null,
          route: "article.calendar",
          caret: false,
        },
        {
          name: "article.categories",
          display_name: "Categories",
          icon: null,
          route: "article.categories",
          caret: false,
        },
      ],
    },
  ];
}
