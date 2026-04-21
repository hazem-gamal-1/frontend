import MaxContainerWrapper_Section from "@/components/maxContainerWrapper_Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BriefcaseBusinessIcon,
  FileTextIcon,
  IdCardLanyard,
  Plus,
} from "lucide-react";

const MOCKDATA = {
  image: "",
  fullName: "",
  EmailAddress: "",
  Bio: "",
  JobTitle: "",
  Industry: "",
  LinkedIn_URL: "",
  cv: "",
};

export default function Settings() {
  return (
    <MaxContainerWrapper_Section className="mt-10 flex justify-center items-center">
      <section className="max-w-5xl flex-1 relative">
        <h3 className="font-bold text-3xl">Profile Settings</h3>
        <p className="text-zinc-400 mb-10 mt-1">
          Update your personal information and professional presence for
          AI-driven interviews.
        </p>

        <section className="flex flex-col gap-4">
          <div className=" px-6 py-7 flex w-full gap-8 bg-card rounded-2xl border border-secondary">
            <div className="rounded-full bg-purple-600 size-24" />
            <div className=" flex flex-col gap-4 ">
              <div className="-space-y-0.5">
                <h4 className="font-bold text-[18px]">Profile Photo</h4>
                <p className="text-zinc-400 text-sm">
                  Upload a clear photo for the AI interviewer and recruiters.
                  PNG or JPG, max 5MB.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  className="text-sm py-4 bg-primary/70"
                  variant={"default"}
                >
                  Upload New
                </Button>
                <Button className="text-sm py-4" variant={"secondary"}>
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full px-6 py-7 rounded-2xl bg-card border border-secondary">
            <h4 className="flex font-bold text-[18px] gap-1 mb-6">
              <IdCardLanyard className="text-primary" />
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-secondary-foreground">
                  Full Name
                </Label>
                <Input id="name" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-secondary-foreground">
                  Email Address
                </Label>
                <Input id="email" className="h-10" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="email" className="text-secondary-foreground">
                  Professional Bio
                </Label>
                <Textarea id="email" className="h-24" />
              </div>
            </div>
          </div>

          <div className="w-full px-6 py-7 rounded-2xl bg-card border border-secondary">
            <h4 className="flex font-bold text-[18px] gap-1 mb-6">
              <BriefcaseBusinessIcon className="text-primary" />
              Professional Experience
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-secondary-foreground">
                  Job Title
                </Label>
                <Input id="jobTitle" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedIn" className="text-secondary-foreground">
                  LinkedIn URL
                </Label>
                <InputGroup id="linkedIn" className="h-10">
                  <InputGroupInput placeholder="" />
                  <InputGroupAddon>
                    <p>linkedin.com/in/</p>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="w-full px-6 py-7 rounded-2xl bg-card border border-secondary">
            <h4 className="flex font-bold text-[18px] gap-1 mb-6">
              <FileTextIcon className="text-primary" />
              Resumes / CVs
            </h4>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col justify-center items-center">
                <FileTextIcon className="text-primary w-20 h-25" />
                <p>CV-1</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <FileTextIcon className="text-primary w-20 h-25" />
                <p>CV-2</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <FileTextIcon className="text-primary w-20 h-25" />
                <p>CV-3</p>
              </div>
              <div className="flex justify-center mx-4 items-center ">
                <Button
                  variant={"secondary"}
                  className="bg-secondary rounded-full size-10"
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <footer className=" sticky bottom-0 flex justify-end gap-5 pt-12 pb-4 bg-linear-to-b from-transparent to-20% to-background">
          <Button
            variant={"ghost"}
            className="px-6 py-4.5 font-semibold text-[16px]"
          >
            Discard Changes
          </Button>
          <Button
            variant={"default"}
            className="px-6 py-4.5 font-semibold text-[16px] bg-primary/70"
          >
            Save Changes
          </Button>
        </footer>
      </section>
    </MaxContainerWrapper_Section>
  );
}
