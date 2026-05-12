// import { useState } from "react";

// import axios from "axios";

// import DashboardLayout from "../../layout/DashboardLayout";

// import "../../styles/create-course.css";

// const API_URL = import.meta.env.VITE_API_URL;

// function CreateCourse() {

//   /* STEP */
//   const [step, setStep] = useState(1);

//   /* TOKEN */
//   const token =
//     localStorage.getItem("token");

//   /* COURSE */
//   const [courseData, setCourseData] =
//     useState({
//       title: "",
//       description: "",
//     });

//   const [createdCourse, setCreatedCourse] =
//     useState(null);

//   /* MODULE */
//   const [moduleData, setModuleData] =
//     useState({
//       title: "",
//       orderIndex: "",
//     });

//   const [createdModule, setCreatedModule] =
//     useState(null);

//   /* CONTENT */
//   const [contentData, setContentData] =
//     useState({
//       type: "VIDEO",
//       orderIndex: "",
//       file: null,
//     });

//   /* CREATE COURSE */
//   const handleCreateCourse = async (
//     e
//   ) => {

//     e.preventDefault();

//     try {

//       const response = await axios.post(
//         `${API_URL}/api/courses`,
//         courseData,
//         {
//           headers: {
//             Authorization:
//               `Bearer ${token}`,
//           },
//         }
//       );

//       setCreatedCourse(response.data);

//       alert("Course Created");

//       setStep(2);

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   /* CREATE MODULE */
//   const handleCreateModule = async (
//     e
//   ) => {

//     e.preventDefault();

//     try {

//       const response = await axios.post(
//         `${API_URL}/api/courses/${createdCourse.id}/modules`,
//         {
//           title: moduleData.title,
//           orderIndex:
//             Number(
//               moduleData.orderIndex
//             ),
//         },
//         {
//           headers: {
//             Authorization:
//               `Bearer ${token}`,
//           },
//         }
//       );

//       setCreatedModule(response.data);

//       alert("Module Added");

//       setStep(3);

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   /* UPLOAD CONTENT */
//   const handleUploadContent = async (
//     e
//   ) => {

//     e.preventDefault();

//     try {

//       const formData = new FormData();

//       formData.append(
//         "file",
//         contentData.file
//       );

//       formData.append(
//         "type",
//         contentData.type
//       );

//       formData.append(
//         "orderIndex",
//         contentData.orderIndex
//       );

//       await axios.post(
//         `${API_URL}/api/courses/modules/${createdModule.id}/contents`,
//         formData,
//         {
//           headers: {
//             Authorization:
//               `Bearer ${token}`,
//             "Content-Type":
//               "multipart/form-data",
//           },
//         }
//       );

//       alert("Content Uploaded");

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   return (

//     <DashboardLayout>

//       <div className="create-course-page">

//         <h1>
//           Create Course
//         </h1>

//         {/* STEP 1 */}
//         {step === 1 && (

//           <form
//             className="course-form"
//             onSubmit={handleCreateCourse}
//           >

//             <input
//               type="text"
//               placeholder="Course Title"
//               value={courseData.title}
//               onChange={(e) =>
//                 setCourseData({
//                   ...courseData,
//                   title: e.target.value,
//                 })
//               }
//             />

//             <textarea
//               placeholder="Course Description"
//               value={
//                 courseData.description
//               }
//               onChange={(e) =>
//                 setCourseData({
//                   ...courseData,
//                   description:
//                     e.target.value,
//                 })
//               }
//             />

//             <button>
//               Create Course
//             </button>

//           </form>

//         )}

//         {/* STEP 2 */}
//         {step === 2 && (

//           <form
//             className="course-form"
//             onSubmit={handleCreateModule}
//           >

//             <input
//               type="text"
//               placeholder="Module Title"
//               value={moduleData.title}
//               onChange={(e) =>
//                 setModuleData({
//                   ...moduleData,
//                   title: e.target.value,
//                 })
//               }
//             />

//             <input
//               type="number"
//               placeholder="Order Index"
//               value={
//                 moduleData.orderIndex
//               }
//               onChange={(e) =>
//                 setModuleData({
//                   ...moduleData,
//                   orderIndex:
//                     e.target.value,
//                 })
//               }
//             />

//             <button>
//               Add Module
//             </button>

//           </form>

//         )}

//         {/* STEP 3 */}
//         {step === 3 && (

//           <form
//             className="course-form"
//             onSubmit={handleUploadContent}
//           >

//             {/* FILE */}
//             <input
//               type="file"
//               onChange={(e) =>
//                 setContentData({
//                   ...contentData,
//                   file:
//                     e.target.files[0],
//                 })
//               }
//             />

//             {/* TYPE */}
//             <select
//               value={contentData.type}
//               onChange={(e) =>
//                 setContentData({
//                   ...contentData,
//                   type: e.target.value,
//                 })
//               }
//             >

//               <option value="VIDEO">
//                 VIDEO
//               </option>

//               <option value="PDF">
//                 PDF
//               </option>

//               <option value="QUIZ">
//                 QUIZ
//               </option>

//             </select>

//             {/* ORDER */}
//             <input
//               type="number"
//               placeholder="Order Index"
//               value={
//                 contentData.orderIndex
//               }
//               onChange={(e) =>
//                 setContentData({
//                   ...contentData,
//                   orderIndex:
//                     e.target.value,
//                 })
//               }
//             />

//             <button>
//               Upload Content
//             </button>

//           </form>

//         )}

//       </div>

//     </DashboardLayout>
//   );
// }

// export default CreateCourse;

import { useState } from "react";

import axios from "axios";

import DashboardLayout from "../../layout/DashboardLayout";

import "../../styles/create-course.css";

const API_URL = import.meta.env.VITE_API_URL;

function CreateCourse() {

  const token =
    localStorage.getItem("token");

  /* ALL FORM DATA */
  const [formData, setFormData] =
    useState({
      courseTitle: "",
      courseDescription: "",

      moduleTitle: "",
      moduleOrder: "",

      contentType: "VIDEO",
      contentOrder: "",
      file: null,
    });

  const [loading, setLoading] =
    useState(false);

  /* HANDLE SUBMIT */
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      /* =========================
         1. CREATE COURSE
      ========================== */

      const courseResponse =
        await axios.post(
          `${API_URL}/api/courses`,
          {
            title:
              formData.courseTitle,
            description:
              formData.courseDescription,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const createdCourse =
        courseResponse.data;

      /* =========================
         2. CREATE MODULE
      ========================== */

      const moduleResponse =
        await axios.post(
          `${API_URL}/api/courses/${createdCourse.id}/modules`,
          {
            title:
              formData.moduleTitle,

            orderIndex: Number(
              formData.moduleOrder
            ),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const createdModule =
        moduleResponse.data;

      /* =========================
         3. UPLOAD CONTENT
      ========================== */

      const uploadData =
        new FormData();

      uploadData.append(
        "file",
        formData.file
      );

      uploadData.append(
        "type",
        formData.contentType
      );

      uploadData.append(
        "orderIndex",
        formData.contentOrder
      );

      await axios.post(
        `${API_URL}/api/courses/modules/${createdModule.id}/contents`,
        uploadData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Course Created Successfully"
      );

      /* RESET */
      setFormData({
        courseTitle: "",
        courseDescription: "",

        moduleTitle: "",
        moduleOrder: "",

        contentType: "VIDEO",
        contentOrder: "",
        file: null,
      });

    } catch (error) {

      console.log(error);

      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (

    <DashboardLayout>

      <div className="create-course-page">

        <h1>
          Create Course
        </h1>

        <form
          className="course-form"
          onSubmit={handleSubmit}
        >

          {/* COURSE */}

          <input
            type="text"
            placeholder="Course Title"
            value={
              formData.courseTitle
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                courseTitle:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Course Description"
            value={
              formData.courseDescription
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                courseDescription:
                  e.target.value,
              })
            }
          />

          {/* MODULE */}

          <input
            type="text"
            placeholder="Module Title"
            value={
              formData.moduleTitle
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                moduleTitle:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Module Order"
            value={
              formData.moduleOrder
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                moduleOrder:
                  e.target.value,
              })
            }
          />

          {/* CONTENT */}

          <input
            type="file"
            onChange={(e) =>
              setFormData({
                ...formData,
                file:
                  e.target.files[0],
              })
            }
          />

          <select
            value={
              formData.contentType
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                contentType:
                  e.target.value,
              })
            }
          >

            <option value="VIDEO">
              VIDEO
            </option>

            <option value="PDF">
              PDF
            </option>

            <option value="QUIZ">
              QUIZ
            </option>

          </select>

          <input
            type="number"
            placeholder="Content Order"
            value={
              formData.contentOrder
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                contentOrder:
                  e.target.value,
              })
            }
          />

          <button
            type="submit"
          >
            {loading
              ? "Creating..."
              : "Create Course"}
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}

export default CreateCourse;