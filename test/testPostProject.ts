import { IProject } from "../interfaces/projectDocument";
import { ITask } from "../interfaces/taskDocument";

async function testPostTour(
  url: string,
  data: { projectData: IProject; tasksData: ITask[] },
) {
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

const newProject: { projectData: IProject; tasksData: ITask[] } = {
  projectData: {
    name: "دیجیتال مارکتینگ دیوید جونز",
    description:
      "شروع به درآمد در واحد مارکتنیگ دیوید جونز و رسیدن به درآمد های اولیه در طی 6 ماه.",
    teamId: "69df5fc47621324e98a37b93",
    ownerId: "69df5fc47621324e98a37b90",
    stages: [
      {
        name: "طراحی سایت دیوید جونز",
        order: 1,
        taskAssignments: [
          {
            taskTitle: "ایجاد سایت",
            assigneeId: "69df5fc47621324e98a37b88",
            assigneeName: "معین کاظمی",
          },
        ],
      },
      {
        name: "مدیریت پیج دیوید جونز",
        order: 2,
        taskAssignments: [
          {
            taskTitle: "پست و استوری روزانه برای دیوید جونز",
            assigneeId: "69df5fc47621324e98a37b89",
            assigneeName: "غزاله میر آبادی",
          },
        ],
      },
    ],
  },
  tasksData: [
    {
      projectId: "",
      stageId: "",
      title: "ایجاد سایت",
      description:
        "ساخت سایت ورد پرس با استفاده از وودمارت و ووکامرس و المنتور به شکلی بسیار زیبا.",
      assigneeTo: {
        assigneeId: "69df5fc47621324e98a37b52",
        assigneeName: "معین کاظمی",
      },
    },
    {
      projectId: "",
      stageId: "",
      title: "پست و استوری روزانه برای دیوید جونز",
      description:
        "روزانه باید یک پست و چهار استوری برای پیج دیوید جونز گذاشته شود.",
      assigneeTo: {
        assigneeId: "69df5fc47621324e98a37b40",
        assigneeName: "غزاله میر آبادی",
      },
    },
  ],
};

testPostTour("http://127.0.0.1:5000/api/v1/projects", newProject);
