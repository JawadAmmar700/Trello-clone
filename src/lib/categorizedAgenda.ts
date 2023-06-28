import type { Agenda } from "@prisma/client";

const categorizedAgenda = async (agendas: Agenda[]) => {
  const categorizedAgendas = new Map<string, Agenda[]>();
  categorizedAgendas.set(
    "todos",
    agendas.filter((agenda) => agenda.status === "TODO")
  );
  categorizedAgendas.set(
    "inProgress",
    agendas.filter((agenda) => agenda.status === "INPROGRESS")
  );

  categorizedAgendas.set(
    "done",
    agendas.filter((agenda) => agenda.status === "DONE")
  );
  return categorizedAgendas;
};

export { categorizedAgenda };
