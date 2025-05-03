"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilterCarousel } from "@/components/FilterCarousel";
import { toast } from "react-toastify";

const HomePage = () => {
  return (
    <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>

        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <Input placeholder="Ini input" />
      <Textarea placeholder="Ini text area" />
      <Progress value={50} className="w-full" />

      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <FilterCarousel
        onSelect={(value) => {
          toast.success(`Selected: ${JSON.stringify(value)}`);
        }}
        data={[
          {
            label: "Label 1",
            value: "value1",
          },
        ]}
      />
    </div>
  );
};

export default HomePage;
