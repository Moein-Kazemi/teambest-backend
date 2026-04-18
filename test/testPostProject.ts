interface ITaskAssigneement {
  taskId?: string;
  taskTitle: string;
  assigneeId: string;
  assigneeName: string;
}

interface IStage {
  name: string;
  order: number;
  taskAssignments: ITaskAssigneement[];
}

interface PostProp {
  name: string;
  description?: string;
  teamId: string;
  ownerId: string;
  stages: IStage[];
}

async function testPostTour(url: string, data: PostProp) {
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

const newProject: PostProp = {
  name: "دیجیتال مارکتینگ دیوید جونز",
  description: "رشد برند فرانسوی کیف برای رسیدن به فروش بالاتر اینترنتی",
  teamId: "69c3b3b5717f20553ca4b4eb",
  ownerId: "69c3b3b5717f20553ca4b4ee",
  stages: [
    {
      name: "طراحی سایت دیوید جونز",
      order: 1,
      taskAssignments: [
        {
          taskId: "69c3b3b5717f20553ca4b8eb",
          taskTitle: "طراحی UI و کد نویسی فرانت اند",
          assigneeId: "69c3b3b5718f20553ca4b4eb",
          assigneeName: "معین کاظمی",
        },
        {
          taskId: "69c3b3b5717f20553ca4b8eb",
          taskTitle: "طراحی UI و کد نویسی فرانت اند",
          assigneeId: "69c3b3b5718f20553ca4b4eb",
          assigneeName: "محمد عباسی",
        },
      ],
    },
    {
      name: "تولید محتوا در اینستاگرام",
      order: 2,
      taskAssignments: [
        {
          taskId: "69c3b3b5717f20555ca4b4eb",
          taskTitle: "تولید پست و استوری دیوید جونز",
          assigneeId: "69c3b3b5717f20554ca4b4eb",
          assigneeName: "غزاله میرآبادی",
        },
      ],
    },
  ],
};

testPostTour("http://127.0.0.1:5000/api/v1/projects", newProject);
