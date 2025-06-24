from django.contrib import admin
from .models import Test, Question, Answer

class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 1

class QuestionInline(admin.TabularInline):
    model = Test.questions.through  # la relazione ManyToMany di Test->Question

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    exclude = ('questions',)  # evitiamo il doppio campo; gestito da inline

# registra Answer se vuoi gestirlo separatamente
# @admin.register(Answer)
# class AnswerAdmin(admin.ModelAdmin):
#     pass