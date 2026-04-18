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
  projectId: "69df5fc47621324e98a37b81",
  stageId: "69df5fc47621324e98a37b83",
  title: "عکاسی محصولات ایواز",
  description: "کالکشن جدید ایواز عکاسی بشود و به سایت اضافه بشود",
  assigneeTo: {
    assigneeId: "69c3b3b5718f20553ca7b8eb",
    assigneeName: "یاسمن کاظمی",
  },
};

testPostTask("http://127.0.0.1:5000/api/v1/tasks", newTask);
