import { ITask } from "../interfaces/taskDocument";

async function testUpdateTour(url: string, data: Partial<ITask>) {
  try {
    // name: "طبیعت سبز شمال" =>
    // "طبیعت سبز و زیبای شمال"
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Error message: ${err.message}`);
    } else {
      throw new Error(`Error code: ${err}`);
    }
  }
}
const updateData: Partial<ITask> = {
  title: "فیلم برداری از یاسمن اقلیدی",
};

const result = testUpdateTour(
  "http://127.0.0.1:5000/api/v1/tasks/69e347d6a97644535c32bdcf",
  updateData,
);
console.log(result);
