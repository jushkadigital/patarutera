"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming shadcn/ui is set up with this alias

interface MyCustomCardProps {
  title?: string;
  description?: string;
  headerContent?: React.ReactNode;
  bodyContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function MyCustomCard({
  title = "Default Card Title",
  description,
  headerContent,
  bodyContent,
  footerContent,
}: MyCustomCardProps) {
  return (
    <Card className="w-[350px]"> {/* Default width, can be customized */}
      <CardHeader>
        {headerContent ? (
          headerContent
        ) : (
          <>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </>
        )}
      </CardHeader>
      <CardContent>
        {bodyContent ? (
          bodyContent
        ) : (
          <p>This is the default body content. Replace with your actual content.</p>
        )}
      </CardContent>
      <CardFooter>
        {footerContent ? (
          footerContent
        ) : (
          <p>Default footer content.</p>
        )}
      </CardFooter>
    </Card>
  );
}

// Example Usage (you can remove this or move it to another file):
//
// import { Button } from "@/components/ui/button";
//
// export function CardDemo() {
//   return (
//     <MyCustomCard
//       title="Project Showcase"
//       description="An overview of the latest project."
//       bodyContent={
//         <div>
//           <p>Detailed information about the project features and outcomes.</p>
//           <img src="https://via.placeholder.com/300x150" alt="Placeholder" className="mt-2 rounded-md" />
//         </div>
//       }
//       footerContent={
//         <div className="flex justify-between w-full">
//           <Button variant="outline">Learn More</Button>
//           <Button>Deploy</Button>
//         </div>
//       }
//     />
//   )
// } 