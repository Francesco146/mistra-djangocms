from django.contrib import admin
from .models import (
    Test,
    Question,
    Answer,
    Category,
    TestExecution,
    GivenAnswer,
    Sex,
)


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 1


class QuestionInline(admin.TabularInline):
    model = Test.questions.through  
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    exclude = ("questions",)  

class GivenAnswerInline(admin.TabularInline):
    model = GivenAnswer
    extra = 0
    fields = ("question", "answer")
    readonly_fields = ("question", "answer")

@admin.register(TestExecution)
class TestExecutionAdmin(admin.ModelAdmin):
    list_display = ("id", "test", "age", "score", "IP", "duration", "execution_time")
    readonly_fields = ("execution_time",)
    inlines = [GivenAnswerInline]


@admin.register(Sex)
class SexAdmin(admin.ModelAdmin):
    pass
