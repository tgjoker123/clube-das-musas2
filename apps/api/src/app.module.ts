import { Module } from "@nestjs/common";
import { DatabaseModule } from "./core/database/database.module";
import { SupabaseModule } from "./core/supabase/supabase.module";
import { StorageModule } from "./core/storage/storage.module";
import { AuthModule } from "./core/auth/auth.module";
import { ProfessorsModule } from "./modules/professors/professors.module";
import { StudentsModule } from "./modules/students/students.module";
import { ExercisesModule } from "./modules/exercises/exercises.module";
import { WorkoutsModule } from "./modules/workouts/workouts.module";
import { CheckinsModule } from "./modules/checkins/checkins.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [
    DatabaseModule,
    SupabaseModule,
    StorageModule,
    AuthModule,
    ProfessorsModule,
    StudentsModule,
    ExercisesModule,
    WorkoutsModule,
    CheckinsModule,
    DashboardModule,
  ],
})
export class AppModule {}
