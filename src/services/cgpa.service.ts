import { mockStorage } from './mockStorage';
import type { Course } from '../types/mock';

interface CourseInput {
  code: string;
  name: string;
  grade: number;
  units: number;
  semester: string;
  type: 'core' | 'elective';
  credit: number;
  year: number;
  status: 'completed' | 'in_progress' | 'planned';
}

class CGPAService {
  async addCourse(userId: string, courseData: CourseInput): Promise<Course> {
    const course = await mockStorage.courses.create({
      ...courseData,
      userId,
    });

    // Update CGPA after adding course
    mockStorage.cgpa.update(userId);

    return course;
  }

  async updateCourse(courseId: string, updates: Partial<CourseInput>): Promise<Course> {
    const course = await mockStorage.courses.get(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const updatedCourse = await mockStorage.courses.update(courseId, updates);

    // Update CGPA after course update
    mockStorage.cgpa.update(course.userId);

    return updatedCourse;
  }

  async deleteCourse(courseId: string): Promise<void> {
    const course = await mockStorage.courses.get(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const userId = course.userId;
    await mockStorage.courses.delete(courseId);

    // Update CGPA after deleting course
    mockStorage.cgpa.update(userId);
  }

  async calculateSemesterGPA(userId: string, semester: string): Promise<number> {
    const courses = await mockStorage.courses.getAll(userId);
    const semesterCourses = courses.filter(c => c.semester === semester);
    return mockStorage.utils.calculateGPA(semesterCourses);
  }

  async getCGPA(userId: string): Promise<number> {
    return mockStorage.cgpa.calculate(userId);
  }

  async getCourses(userId: string): Promise<Course[]> {
    return mockStorage.courses.getAll(userId);
  }

  async getSemesterCourses(userId: string, semester: string): Promise<Course[]> {
    const courses = await mockStorage.courses.getAll(userId);
    return courses.filter(c => c.semester === semester);
  }
}

export const cgpaService = new CGPAService();
