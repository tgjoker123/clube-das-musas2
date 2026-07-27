import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { DatabaseModule } from "./core/database/database.module";
import { SupabaseModule } from "./core/supabase/supabase.module";
import { StorageModule } from "./core/storage/storage.module";
import { MailModule } from "./core/mail/mail.module";
import { AuthModule } from "./core/auth/auth.module";
import { ProfessorsModule } from "./modules/professors/professors.module";
import { StudentsModule } from "./modules/students/students.module";
import { ExercisesModule } from "./modules/exercises/exercises.module";
import { WorkoutsModule } from "./modules/workouts/workouts.module";
import { CheckinsModule } from "./modules/checkins/checkins.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { AdminModule } from "./modules/admin/admin.module";
import { AvaliacoesModule } from "./modules/avaliacoes/avaliacoes.module";
import { DesafiosModule } from "./modules/desafios/desafios.module";
import { RecordesModule } from "./modules/recordes/recordes.module";
import { RecadosModule } from "./modules/recados/recados.module";

@Module({
  controllers: [AppController],
  imports: [
    DatabaseModule,
    SupabaseModule,
    StorageModule,
    MailModule,
    AuthModule,
    ProfessorsModule,
    StudentsModule,
    ExercisesModule,
    WorkoutsModule,
    CheckinsModule,
    DashboardModule,
    LeadsModule,
    AdminModule,
    AvaliacoesModule,
    DesafiosModule,
    RecordesModule,
    RecadosModule,
  ],
})
export class AppModule {}
