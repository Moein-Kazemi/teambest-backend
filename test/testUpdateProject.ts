import { IProject } from "../interfaces/projectDocument";
import { ITask } from "../interfaces/taskDocument";

async function testUpdateProject(
  url: string,
  data: { projectData: Partial<IProject>; taskData?: ITask[] },
) {
  try {
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
const updateData: { projectData: Partial<IProject>; taskData?: ITask[] } = {
  projectData: {
    name: "دیجیتال مارکتینگ فروشگاه خانه پوشاک",
  },
};

const result = testUpdateProject(
  "http://127.0.0.1:5000/api/v1/projects/69e4b09b4d942109702cc3a8",
  updateData,
);
console.log(result);
