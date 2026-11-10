/** A separate explicit opt-in; never a production or authenticated route. */
export function teacherCoursePreviewEnabled({ dev, catalogFlag, catalogApiFlag, m5Flag, m5ApiFlag }) {
  return dev === true &&
    catalogFlag === "true" &&
    catalogApiFlag === "true" &&
    m5Flag === "true" &&
    m5ApiFlag === "true";
}
