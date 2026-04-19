import { IProject } from "../interfaces/projectDocument";
import { ITask } from "../interfaces/taskDocument";

async function testPostTour(
  url: string,
  data: { projectData: IProject; taskData: ITask[] },
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

const newProject: { projectData: IProject; taskData: ITask[] } = {
  projectData: {
    name: "دیجیتال مارکتینگ جین شاپ",
    description:
      "انقلابی در فروش اینترنتی جین شاپ و رساندن فروش آن از صفر به مثبت 100 قلم در ماه.",
    teamId: "69df5fc47621324e98a37b93",
    ownerId: "69df5fc47621324e98a37b90",
    stages: [
      {
        name: "طراحی سایت جین شاپ",
        order: 1,
        taskAssignments: [
          {
            taskTitle: "ایجاد سایت ورد پرسی",
            assigneeId: "69df5fc47621324e98a37b88",
            assigneeName: "مبینا غلامی",
          },
        ],
      },
      {
        name: "مدیریت اینستاگرام جین شاپ",
        order: 2,
        taskAssignments: [
          {
            taskTitle: "پست و استوری روزانه",
            assigneeId: "69df5fc47621324e98a37b89",
            assigneeName: "علی شاهینی",
          },
        ],
      },
    ],
  },
  taskData: [
    {
      projectId: "",
      stageId: "",
      title: "ایجاد سایت ورد پرسی",
      description:
        "ساخت سایت ورد پرس با استفاده از وودمارت و ووکامرس و المنتور به شکلی بسیار زیبا.",
      assigneeTo: {
        assigneeId: "69df5fc47621324e98a37b52",
        assigneeName: "مبینا غلامی",
      },
    },
    {
      projectId: "",
      stageId: "",
      title: "پست و استوری روزانه",
      description:
        "روزانه باید یک پست و چهار استوری برای پیج جین شاپ گذاشته شود.",
      assigneeTo: {
        assigneeId: "69df5fc47621324e98a37b40",
        assigneeName: "علی شاهینی",
      },
    },
  ],
};

testPostTour("http://127.0.0.1:5000/api/v1/projects", newProject);
