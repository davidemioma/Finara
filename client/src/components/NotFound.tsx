import Logo from "./Logo";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex h-14 items-center border-b px-4 sm:px-6">
        <Logo />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-[400px] shadow-md">
          <CardHeader>
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <h1 className="text-3xl font-semibold">Page not found!</h1>

              <p className="text-sm text-muted-foreground">
                Click link to go back.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex w-full items-center justify-center">
              <ExclamationTriangleIcon className="text-destructive" />
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" variant="link" size="sm" asChild>
              <Link to="/">Back to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
