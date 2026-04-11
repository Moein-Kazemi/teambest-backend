interface TaskProp {
  title: string;
  description: string;
  projectInfo?: { _id: string; name: string };
  assigneeTo?: { _id: string; name: string };
  //   remove if the project info hase stage field
  stageInfo?: { _id: string; name: string };
  status: string;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
}

async function testPostTour(url: string, data: TaskProp) {
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

const newTask: TaskProp = {
  title: "تست ساختن",
  description: "توضیحات تست ساختن",
  status: "انجام نشده",
};

testPostTour("http://127.0.0.1:5000/api/v1/tasks", newTask);
