"use client";
import type { Agenda } from "@prisma/client";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Icons from "@/lib/icons";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/utils/uploadthing";
import { useToast } from "./ui/use-toast";
import { categorizedAgenda } from "@/lib/categorizedAgenda";
import { useAgendaStore } from "@/lib/store";
import {
  createAgendasType,
  deleteAgendasType,
  updateAgendasType,
} from "@/lib/api-fucns";

const Agenda = () => {
  const [state, setState] = useAgendaStore((state) => [
    state.agendas,
    state.setAgendas,
  ]);
  const { data } = useQuery({
    queryKey: ["agendas"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/agenda`);
      const data = await res.json();
      const categorized = await categorizedAgenda(data);
      return categorized;
    },
  });

  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    if (!data) return;
    setState(data);
  }, [data]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rezise = () => {
      if (window.innerWidth < 768) setIsSmallScreen(true);
      else setIsSmallScreen(false);
    };
    window.addEventListener("resize", rezise);

    return () => {
      window.removeEventListener("resize", rezise);
    };
  }, [window]);

  const { mutate: createAgenda } = useMutation({
    mutationFn: createAgendasType,
    onError: (err: any) => {},
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agendas"] });
      queryClient.invalidateQueries({ queryKey: ["gpt-suggestion"] });
      toast({
        title: "Success",
        description: "Agenda created successfully!",
        color: "green",
      });
    },
  });

  const { mutate: deleteAgenda } = useMutation({
    mutationFn: deleteAgendasType,
    onError: (err: any) => {
      console.log(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendas"] });
      queryClient.invalidateQueries({ queryKey: ["gpt-suggestion"] });
      toast({
        title: "Success",
        description: "Agenda deleted successfully!",
        color: "green",
      });
    },
  });

  const { mutate: updateDB } = useMutation({
    mutationFn: updateAgendasType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agendas"],
      });
      queryClient.invalidateQueries({ queryKey: ["gpt-suggestion"] });
    },
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    if (type === "column") {
      const entries = Array.from(state.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      setState(new Map(entries));
    }
    if (type === "card") {
      const start = state.get(source.droppableId);
      const finish = state.get(destination.droppableId);

      if (!start || !finish) return;

      const [removed] = start.splice(source.index, 1);
      finish.splice(destination.index, 0, removed);
      setState(new Map(state.entries()));

      updateDB({ id: removed.id, newStatus: destination.droppableId });
    }
  };

  const handleCreation = () => {
    if (!title || !type)
      return toast({
        title: "Error",
        description: "Please fill all the fields",
        variant: "destructive",
      });
    createAgenda({ data: { title, image, type } });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="agenda"
        direction={isSmallScreen ? "vertical" : "horizontal"}
        type="column"
      >
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="container grid grid-cols-1 md:grid-cols-3 gap-4 place-items-start"
          >
            {Array.from(state).map(([status, data], id) => (
              <Draggable key={status} draggableId={status} index={id}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="w-full flex flex-col space-y-3"
                  >
                    <Droppable droppableId={status} key={status} type="card">
                      {(provided, snapshot) => (
                        <div
                          className={`w-full p-2 bg-white/30 rounded-xl ${
                            snapshot.isDraggingOver && "bg-lime-200"
                          } `}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <div className="flex items-center justify-between p-2 ">
                            <h1 className="text-xl font-bold">{status}</h1>
                            <Badge
                              variant="secondary"
                              className="bg-gray-200 rouned"
                            >
                              {data.length}
                            </Badge>
                          </div>
                          {data.map((agenda, index) => (
                            <Draggable
                              key={agenda.id}
                              draggableId={agenda.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="w-full p-2 bg-white/90 rounded-lg mb-2 flex flex-col space-y-2"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="flex items-center justify-between ">
                                    <h1 className="text-xs font-bold">
                                      {agenda.title}
                                    </h1>
                                    <Button
                                      variant="ghost"
                                      onClick={() =>
                                        deleteAgenda({ id: agenda.id })
                                      }
                                    >
                                      <Icons.Trash className="w-4" />
                                    </Button>
                                  </div>

                                  {agenda.image && (
                                    <div className="relative w-full h-[250px]">
                                      <Image
                                        src={agenda.image}
                                        alt={`${agenda.title}-${agenda.status}`}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className=" rounded"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <div className="flex items-center justify-end">
                      <Dialog>
                        <DialogTrigger>
                          <div className="bg-green-500 rounded-full p-1 hover:bg-green-400">
                            <Icons.Plus className="w-4" />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] h-[500px] overflow-y-scroll">
                          <DialogHeader>
                            <DialogTitle>Create new Agenda</DialogTitle>
                            <DialogDescription>
                              The seminar on effective time management is to
                              optimizing productivity and to manage their time
                              efficiently in personal and professional life.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Title
                              </Label>
                              <Input
                                id="title"
                                value={title}
                                className="col-span-3"
                                onChange={(e) => setTitle(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor=" Agenda Type"
                                className="text-right"
                              >
                                Type
                              </Label>
                              <Select onValueChange={(value) => setType(value)}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TODO">TODO</SelectItem>
                                  <SelectItem value="INPROGRESS">
                                    INPROGRESS
                                  </SelectItem>
                                  <SelectItem value="DONE">DONE</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="image" className="text-right">
                                Image
                              </Label>
                              <div className="flex justify-start w-full col-span-2">
                                <UploadButton
                                  endpoint="imageUploader"
                                  onClientUploadComplete={(res) => {
                                    console.log("Files: ", res);
                                    if (res !== undefined) {
                                      setImage(res[0].fileUrl);
                                    }
                                    toast({
                                      title: "Success",
                                      description:
                                        "Image uploaded successfully!",
                                    });
                                  }}
                                  onUploadError={(error: Error) => {
                                    toast({
                                      title: "Error",
                                      description: "Image upload failed!",
                                      variant: "destructive",
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            {image && (
                              <div className="relative w-full h-[250px]">
                                <Image
                                  src={image}
                                  alt={image}
                                  fill
                                  style={{ objectFit: "contain" }}
                                  className=" rounded"
                                />
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleCreation}
                              variant="secondary"
                            >
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Agenda;
