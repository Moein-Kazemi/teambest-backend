import { ITask } from "../interfaces/taskDocument";

async function testPostTask(url: string, data: ITask) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 201) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    // console.log(result);
    return result;
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof Error) {
      throw new Error(`Error message: ${err.message}`);
    } else {
      throw new Error(`Error code: ${err}`);
    }
  }
}

const newTask: ITask = {
  projectId: "69e4b09b4d942109702cc3a8",
  stageId: "69e4b09b4d942109702cc3a9",
  title: "کد نویسی مدل هوش مصنوعی اختصاصی برای وب سایت",
  description:
    "یک پلاگین شامل مدل هوش مصنوعی اختصاصی که بر اساس سلیقه مشتری به آنها بهترین شلوار را برای خرید معرفی میکند.",
  assigneeTo: {
    assigneeId: "69c3b3b5718f20553ca7b9eb",
    assigneeName: "علی کامروا",
  },
};

testPostTask("http://127.0.0.1:5000/api/v1/tasks", newTask);
