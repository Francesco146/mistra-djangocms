from ckeditor.fields import RichTextField
from django.db import models

# Category (*id,nome)
class Category(models.Model):
    name = models.CharField(max_length=255)


# Question (*id,name,text,id_category)
class Question(models.Model):
    name = models.CharField(max_length=255)
    text = RichTextField()  # Contenuto HTML
    id_category = models.ForeignKey(Category, on_delete=models.CASCADE)


# Answer(*id,text,score,correction,id_question)
class Answer(models.Model):
    name = models.CharField(max_length=255)
    text = models.TextField()
    score = models.DecimalField(max_digits=3, decimal_places=2)  # da -1 a 1
    correction = models.TextField(blank=True)
    id_question = models.ForeignKey(
        Question, related_name="answers", on_delete=models.CASCADE
    )


# Test(*id,name,description,min_score)
class Test(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    min_score = models.FloatField()
    questions = models.ManyToManyField(Question, related_name="tests")


# Sex(*id,name)
class Sex(models.Model):
    name = models.CharField(max_length=255)


# TestExecution(*id,execution_time,age,id_sex,id_test,score,IP,duration,revision_date,note)
class TestExecution(models.Model):
    execution_time = models.DateTimeField(auto_now_add=True)
    age = models.PositiveIntegerField()
    sex = models.ForeignKey(Sex, on_delete=models.SET_NULL, null=True)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    IP = models.GenericIPAddressField()
    duration = models.FloatField(help_text="Tempo in minuti")
    revision_date = models.DateTimeField(null=True, blank=True)
    note = models.TextField(blank=True, null=True)


# GivenAnswer(*id, id_test_execution, id_question, id_answer)
class GivenAnswer(models.Model):
    test_execution = models.ForeignKey(TestExecution, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.test_execution.id} - Q{self.question.id} → A{self.answer.id}"
