"use client"
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [placement, setPlacement] = React.useState("");
  const [backdrop, setBackdrop] = React.useState("");



  const handleOpen = () => {
    setPlacement('bottom');
    setBackdrop("opaque");


    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
       
          <Button className="capitalize" onPress={() => handleOpen()}>
            Open
          </Button>
       
      </div>
      <Drawer isOpen={isOpen} placement={placement}  backdrop={backdrop} onOpenChange={onOpenChange}  className="rounded-t-3xl py-4">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Drawer Title</DrawerHeader>
              <DrawerBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                  adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                  officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

