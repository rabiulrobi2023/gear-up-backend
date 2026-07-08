import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.routes";
interface IRouter {
  path: string;
  route: ReturnType<typeof Router>;
}
const router = Router();

const routes: IRouter[] = [
  {
    path: "/auth/register",
    route: AuthRouter,
  },
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
