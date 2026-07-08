import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { adminRouter } from "../modules/admin/admin.route";
import { providerRouter } from "../modules/provider/provider.route";


interface IRouter {
  path: string;
  route: ReturnType<typeof Router>;
}
const router = Router();

const routes: IRouter[] = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/admin",
    route: adminRouter,
  },
  {
    path: "/provider",
    route: providerRouter,
  },
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
