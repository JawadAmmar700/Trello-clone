import { create } from "zustand";
import type { Agenda } from "@prisma/client";

interface AgendaState {
  agendas: Map<string, Agenda[]>;
  setAgendas: (agendas: Map<string, Agenda[]>) => void;
  filterAgendas: (filter: string) => void;
  prevAgendas: Map<string, Agenda[]>;
}

const useAgendaStore = create<AgendaState>((set) => ({
  agendas: new Map<string, Agenda[]>(),
  setAgendas: (agendas: Map<string, Agenda[]>) =>
    set({ agendas, prevAgendas: agendas }),
  filterAgendas: (filter: string) => {
    const { prevAgendas } = useAgendaStore.getState();
    const filteredAgendas = new Map<string, Agenda[]>();
    prevAgendas.forEach((agendas, key) => {
      const filtered = agendas.filter((agenda) =>
        agenda.title.toLowerCase().includes(filter.toLowerCase())
      );
      filteredAgendas.set(key, filtered);
    });
    set({ agendas: filteredAgendas });
  },
  prevAgendas: new Map<string, Agenda[]>(),
}));

export { useAgendaStore };
