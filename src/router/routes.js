import { checkAuth } from "@/service/AuthService";
export default [
  // Auth Login
  {
    path: "/auth",
    children: [
      {
        path: "login",
        name: "auth.login",
        meta: {
          title: "Login",
        },
        component: () => import("@/views/Pages/Auth/Login.vue"),
      },

    ],
  },
  {
    path: "/dashboard",
    name: "dashboard",
    meta: {
      auth: true,
    },
    component: () => import("@/views/Pages/Dashboards/DashboardView.vue"),
  },

  //Article
  {
    path: "/article",
    name: "Article",
    children: [
      {
        path: "articles",
        name: "article.articles",
        meta: {
          title: "Articles",
          auth: true,
          // permission:"articles",
        },
        component: () => import("@/views/Pages/Article/Articles/Index.vue"),
      },
      {
        path: "addArticle",
        name: "article.add-article",
        meta: {
          title: "New Articles/Post",
          auth: true,
          // permission:"articles",
        },
        component: () =>
          import("@/views/Pages/Article/Articles/AddArticles.vue"),
      },
      {
        path: "articles/:slug",
        name: "article.detail-articles",
        meta: {
          title: "Article/Post",
          auth: true,
        },
        component: () => import("@/views/Pages/Article/Articles/Detail.vue"),
      },
      {
        path: "articles-report/:slug",
        name: "article.report-articles",
        meta: {
          title: "Article Report",
          auth: true,
        },
        component: () => import("@/views/Pages/Article/Articles/Report.vue"),
      },
      {
        path: "calendar",
        name: "article.calendar",
        meta: {
          title: "Calendar",
          auth: true,
        },
        component: () => import("@/views/Pages/Article/Calendar/Index.vue"),
      },
      {
        path: "categories",
        name: "article.categories",
        meta: {
          title: "Categories",
          auth: true,
        },
        component: () => import("@/views/Pages/Article/Categories/Index.vue"),
      },
      {
        path: "categories/:slug",
        name: "article.detail-categories",
        meta: {
          title: "Category Detail",
          auth: true,
        },
        component: () => import("@/views/Pages/Article/Categories/Detail.vue"),
      },
    ],
  },

  {
    path: "/",
    redirect: () => {
      return checkAuth() ? "/dashboard" : "/auth/login";
    },
  },
];
