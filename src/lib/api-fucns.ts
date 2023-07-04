export const updateAgendasType = ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: string;
}) => {
  return fetch("http://localhost:3000/api/agenda", {
    method: "POST",
    body: JSON.stringify({ id, newStatus }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteAgendasType = async ({ id }: { id: string }) => {
  return fetch("http://localhost:3000/api/agenda/delete", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const createAgendasType = async ({
  data,
}: {
  data: { title: string; image: string | null; type: string };
}) => {
  return fetch("http://localhost:3000/api/agenda/create", {
    method: "POST",
    body: JSON.stringify({ data }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};
