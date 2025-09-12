import React from "react";
import CourseView from "./CourseView";
import CreateCourseForm from "./CreateCourseForm";

export default function CourseInfo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Course Information</h2>

      {/* Create Course Section */}
      <div className="p-6 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Create a New Course</h3>
        <CreateCourseForm />
      </div>

      {/* Course View Section */}
      <CourseView />
    </div>
  );
}
