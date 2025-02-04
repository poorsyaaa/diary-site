"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BaseProps {
  children: React.ReactNode;
}

interface RootCustomModalProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CustomModalProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const CustomModalContext = React.createContext<{ isDesktop: boolean }>({
  isDesktop: false,
});

const useCustomModalContext = () => {
  const context = React.useContext(CustomModalContext);
  if (!context) {
    throw new Error("CustomModal components cannot be rendered outside the CustomModal Context");
  }
  return context;
};

const CustomModal = ({ children, ...props }: RootCustomModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const CustomModal = isDesktop ? Dialog : Drawer;

  return (
    <CustomModalContext.Provider value={{ isDesktop }}>
      <CustomModal {...props} {...(!isDesktop && { autoFocus: true })}>
        {children}
      </CustomModal>
    </CustomModalContext.Provider>
  );
};

const CustomModalTrigger = ({ className, children, ...props }: CustomModalProps) => {
  const { isDesktop } = useCustomModalContext();
  const CustomModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <CustomModalTrigger className={className} {...props}>
      {children}
    </CustomModalTrigger>
  );
};

const CustomModalClose = ({ className, children, ...props }: CustomModalProps) => {
  const { isDesktop } = useCustomModalContext();
  const CustomModalClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <CustomModalClose className={className} {...props}>
      {children}
    </CustomModalClose>
  );
};

const CustomModalContent = ({ className, children, ...props }: CustomModalProps) => {
  const { isDesktop } = useCustomModalContext();
  const CustomModalContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <CustomModalContent className={className} {...props}>
      {children}
    </CustomModalContent>
  );
};

const CustomModalDescription = ({ className, children, ...props }: CustomModalProps) => {
  const { isDesktop } = useCustomModalContext();
  const CustomModalDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <CustomModalDescription className={className} {...props}>
      {children}
    </CustomModalDescription>
  );
};

const CustomModalHeader = ({ className, children, ...props }: CustomModalProps) => {
  const { isDesktop } = useCustomModalContext();
  const CustomModalHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <CustomModalHeader className={className} {...props}>
      {children}
    </CustomModalHeader>
  );
};

const CustomModalTitle = ({ className, children, ...props }: CustomModalProps) => {
  const { isDesktop } = useCustomModalContext();
  const CustomModalTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <CustomModalTitle className={className} {...props}>
      {children}
    </CustomModalTitle>
  );
};

const CustomModalBody = ({ className, children, ...props }: CustomModalProps) => {
  return (
    <ScrollArea className="overflow-y-auto">
      <div className={cn("px-4 md:px-0", className)} {...props}>
        {children}
      </div>
    </ScrollArea>
  );
};

const CustomModalFooter = ({ className, children, ...props }: CustomModalProps) => {
  const { isDesktop } = useCustomModalContext();
  const CustomModalFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <CustomModalFooter className={className} {...props}>
      {children}
    </CustomModalFooter>
  );
};

export {
  CustomModal,
  CustomModalTrigger,
  CustomModalClose,
  CustomModalContent,
  CustomModalDescription,
  CustomModalHeader,
  CustomModalTitle,
  CustomModalBody,
  CustomModalFooter,
};
