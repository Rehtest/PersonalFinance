# Generated by Django 2.2.12 on 2023-02-06 18:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('personalfinance', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='investment',
            options={'ordering': ['-modified_date']},
        ),
    ]
