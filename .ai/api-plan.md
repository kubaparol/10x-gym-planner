# REST API Plan

## 1. Resources

- **User Profile** (`user_profiles`):

  - Contains personal details such as first name, last name, age, gender, weight, height, and experience level.
  - Managed by Supabase Auth.

- **Training Plan** (`training_plans`):

  - Represents a workout plan created by the user.
  - Fields: name, description, is_active, source.
  - Relationship: Belongs to a user; has many training days.

- **Training Day** (`training_days`):

  - Represents a specific day within a training plan.
  - Field: weekday (0 - Sunday to 6 - Saturday).
  - Relationship: Belongs to a training plan; has many training day exercises.

- **Exercise** (`exercises`):

  - Contains unique exercise names.
  - Generally read-only for regular users; insertion restricted to admin roles.

- **Training Day Exercise** (`training_day_exercises`):

  - Associates exercises with a training day.
  - Fields: order_index, sets, repetitions, rest_time_seconds.
  - Relationship: Belongs to a training day; references an exercise; has many exercise sets.

- **Exercise Set** (`exercise_sets`):

  - Records the details of a performed set for an exercise.
  - Fields: weight, repetitions, performed_at.
  - Relationship: Belongs to a training day exercise.

- **PDF Import** (Business process, no dedicated table):
  - Handles the conversion of PDF workout plans into a structured training plan.
  - Endpoints will support uploading PDF files.

## 2. Endpoints

### Training Plan Endpoints

- **List Training Plans**

  - **Method:** GET
  - **URL:** `/training-plans`
  - **Description:** Retrieve a paginated list of training plans for the authenticated user.
  - **Query Parameters:** `page`, `limit`, `sort_by` (e.g., created_at), `order` (asc/desc)
  - **Response JSON:**
    ```json
    {
      "plans": [
        {
          "id": "UUID",
          "name": "string",
          "description": "string",
          "is_active": "boolean",
          "created_at": "timestamp"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100
      }
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401

- **Create Training Plan**

  - **Method:** POST
  - **URL:** `/training-plans`
  - **Description:** Create a new training plan.
  - **Request JSON:**
    ```json
    {
      "name": "string",
      "description": "string",
      "is_active": "boolean (optional)"
    }
    ```
  - **Response JSON:**
    ```json
    {
      "id": "UUID",
      "message": "Training plan created successfully"
    }
    ```
  - **Success Codes:** 201
  - **Error Codes:** 400, 401

- **Get Training Plan Details**

  - **Method:** GET
  - **URL:** `/training-plans/{plan_id}`
  - **Description:** Retrieve detailed information of a specific training plan, including its training days.
  - **Response JSON:**
    ```json
    {
      "id": "UUID",
      "name": "string",
      "description": "string",
      "is_active": "boolean",
      "training_days": [ { "...day details..." } ]
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

- **Delete Training Plan**
  - **Method:** DELETE
  - **URL:** `/training-plans/{plan_id}`
  - **Description:** Delete a training plan and its associated records.
  - **Response JSON:**
    ```json
    {
      "message": "Training plan deleted successfully"
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

### Training Day Endpoints

- **Create Training Day**

  - **Method:** POST
  - **URL:** `/training-plans/{plan_id}/training-days`
  - **Description:** Add a new training day to a training plan.
  - **Request JSON:**
    ```json
    {
      "weekday": "number (0-6)"
    }
    ```
  - **Response JSON:**
    ```json
    {
      "id": "UUID",
      "message": "Training day created successfully"
    }
    ```
  - **Success Codes:** 201
  - **Error Codes:** 400, 401, 404

- **List Training Days**

  - **Method:** GET
  - **URL:** `/training-plans/{plan_id}/training-days`
  - **Description:** Retrieve a list of training days for a specific training plan.
  - **Response JSON:**
    ```json
    {
      "training_days": [
        {
          "id": "UUID",
          "weekday": "number",
          "created_at": "timestamp"
        }
      ]
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

- **Delete Training Day**
  - **Method:** DELETE
  - **URL:** `/training-days/{day_id}`
  - **Description:** Delete a specific training day.
  - **Response JSON:**
    ```json
    {
      "message": "Training day deleted successfully"
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

### Training Day Exercise Endpoints

- **Add Exercise to Training Day**

  - **Method:** POST
  - **URL:** `/training-days/{day_id}/exercises`
  - **Description:** Add an exercise to a training day.
  - **Request JSON:**
    ```json
    {
      "exercise_id": "UUID",
      "order_index": "number (optional)",
      "sets": "number",
      "repetitions": "number",
      "rest_time_seconds": "number"
    }
    ```
  - **Response JSON:**
    ```json
    {
      "id": "UUID",
      "message": "Exercise added to training day successfully"
    }
    ```
  - **Success Codes:** 201
  - **Error Codes:** 400, 401, 404

- **List Exercises in Training Day**

  - **Method:** GET
  - **URL:** `/training-days/{day_id}/exercises`
  - **Description:** Retrieve a list of exercises for a specific training day.
  - **Response JSON:**
    ```json
    {
      "exercises": [
        {
          "id": "UUID",
          "exercise": { "id": "UUID", "name": "string" },
          "order_index": "number",
          "sets": "number",
          "repetitions": "number",
          "rest_time_seconds": "number"
        }
      ]
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

- **Delete Training Day Exercise**
  - **Method:** DELETE
  - **URL:** `/training-day-exercises/{exercise_id}`
  - **Description:** Remove an exercise from a training day.
  - **Response JSON:**
    ```json
    {
      "message": "Exercise removed from training day successfully"
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

### Exercise Endpoints

- **List Exercises**

  - **Method:** GET
  - **URL:** `/exercises`
  - **Description:** Retrieve a list of available exercises.
  - **Response JSON:**
    ```json
    {
      "exercises": [
        {
          "id": "UUID",
          "name": "string"
        }
      ]
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401

- **Create Exercise**
  - **Method:** POST
  - **URL:** `/exercises`
  - **Description:** Create a new exercise.
  - **Request JSON:**
    ```json
    {
      "name": "string"
    }
    ```
  - **Response JSON:**
    ```json
    {
      "id": "UUID",
      "message": "Exercise created successfully"
    }
    ```
  - **Success Codes:** 201
  - **Error Codes:** 400, 401, 403

### Exercise Set Endpoints

- **Record Exercise Set**

  - **Method:** POST
  - **URL:** `/training-day-exercises/{exercise_id}/sets`
  - **Description:** Record a new set for a training day exercise.
  - **Request JSON:**
    ```json
    {
      "weight": "number",
      "repetitions": "number",
      "performed_at": "timestamp (optional)"
    }
    ```
  - **Response JSON:**
    ```json
    {
      "id": "UUID",
      "message": "Exercise set recorded successfully"
    }
    ```
  - **Success Codes:** 201
  - **Error Codes:** 400, 401, 404

- **List Exercise Sets**

  - **Method:** GET
  - **URL:** `/training-day-exercises/{exercise_id}/sets`
  - **Description:** Retrieve the list of recorded sets for a specific training day exercise.
  - **Response JSON:**
    ```json
    {
      "sets": [
        {
          "id": "UUID",
          "weight": "number",
          "repetitions": "number",
          "performed_at": "timestamp"
        }
      ]
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

- **Delete Exercise Set**
  - **Method:** DELETE
  - **URL:** `/exercise-sets/{set_id}`
  - **Description:** Delete a specific exercise set.
  - **Response JSON:**
    ```json
    {
      "message": "Exercise set deleted successfully"
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

### Workout Flow Endpoints

- **Get Today's Workout**

  - **Method:** GET
  - **URL:** `/workout/today`
  - **Description:** Retrieve the workout scheduled for the current day, based on the active training plan and current weekday.
  - **Response JSON:**
    ```json
    {
      "training_plan": { "...plan details..." },
      "training_day": { "...day details..." },
      "exercises": [ { "...exercise details..." } ]
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

- **Complete Workout Session**

  - **Method:** POST
  - **URL:** `/workout/complete`
  - **Description:** Submit the completed workout details.
  - **Request JSON:**
    ```json
    {
      "sets": [
        {
          "training_day_exercise_id": "UUID",
          "weight": "number",
          "repetitions": "number"
        }
      ]
    }
    ```
  - **Response JSON:**
    ```json
    {
      "message": "Workout session recorded successfully"
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 400, 401

- **Get Workout History**

  - **Method:** GET
  - **URL:** `/workouts/history`
  - **Description:** Retrieve a paginated history of past workout sessions.
  - **Query Parameters:** `page`, `limit`
  - **Response JSON:**
    ```json
    {
      "workouts": [
        {
          "id": "UUID",
          "date": "timestamp",
          "details": { "...summary details..." }
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 50
      }
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401

- **Get Workout Details**
  - **Method:** GET
  - **URL:** `/workouts/{workout_id}`
  - **Description:** Retrieve detailed information of a specific past workout session.
  - **Response JSON:**
    ```json
    {
      "id": "UUID",
      "date": "timestamp",
      "exercises": [ { "...set and exercise details..." } ]
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

### PDF Conversion Endpoints

- **Upload PDF for Conversion**

  - **Method:** POST
  - **URL:** `/training-plans/pdf-import`
  - **Description:** Upload a PDF file to convert it into a training plan structure.
  - **Request:** Multipart/form-data (with file field such as `pdf_file`)
  - **Response JSON:**
    ```json
    {
      "import_id": "UUID",
      "message": "PDF file uploaded successfully. Conversion in progress."
    }
    ```
  - **Success Codes:** 202
  - **Error Codes:** 400, 401

- **Get PDF Conversion Candidate**

  - **Method:** GET
  - **URL:** `/training-plans/pdf-import/{import_id}`
  - **Description:** Retrieve the conversion results for review.
  - **Response JSON:**
    ```json
    {
      "import_id": "UUID",
      "candidate_plan": { "...converted plan details..." },
      "status": "pending/reviewed"
    }
    ```
  - **Success Codes:** 200
  - **Error Codes:** 401, 404

## 3. Authentication and Authorization

- API endpoints (except for registration and login) require authentication via JWT tokens, issued through the Supabase auth system.
- Role-based access is enforced:
  - Regular users can manage their own training plans, days, exercises, and sets.
  - Only admin users can create new exercises.
- Endpoints must implement proper authorization checks to ensure users access only data associated with their user ID.

## 4. Validation and Business Logic

- **Database Constraints:**

  - Validate age (must be between 13 and 100).
  - Validate gender (allowed values: "male", "female", "other", "prefer_not_to_say").
  - Ensure weight and height are greater than 0.
  - Validate training day weekday is between 0 and 6.
  - Ensure exercise set weight is between 0 and 1000 and repetitions are positive.

- **Business Logic:**

  - Users can only view, create, update, or delete resources associated with their account.
  - Deletion of a training plan cascades to delete associated training days, exercises, and sets.
  - PDF conversion endpoints include candidate review functionality before final approval.
  - List endpoints support pagination, filtering, and sorting parameters for optimized performance.

- **Security Measures:**
  - Rate limiting and input sanitization to mitigate abuse.
  - Clear and user-friendly error messages with proper logging of errors and state changes for audit purposes.
