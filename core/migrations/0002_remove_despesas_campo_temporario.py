# Generated by Django 4.2.10 on 2024-02-23 17:23

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="despesas",
            name="campo_temporario",
        ),
    ]
