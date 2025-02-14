Claro, puedo ampliar el ejemplo para que puedas acceder a la base de datos desde diferentes servicios en distintos módulos, usando **MySQL** y el cliente `mysql2`. Para lograr esto, puedes seguir una estructura modular, creando un servicio compartido que maneje la conexión a la base de datos y luego inyectarlo en varios servicios dentro de diferentes módulos.

### **Paso 1: Instalación de Dependencias**

Primero, asegúrate de tener el cliente MySQL `mysql2` instalado:

```bash
npm install mysql2
```

### **Paso 2: Crear un Servicio de Base de Datos Compartido**

Este servicio será responsable de crear la conexión a la base de datos y de ejecutar las consultas SQL. Luego, los otros servicios podrán usar este servicio para acceder a la base de datos.

#### Crear `database.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';

@Injectable()
export class DatabaseService {
  private connection;

  constructor() {
    this.connection = mysql.createPool({
      host: 'localhost',  // Cambia a la configuración de tu base de datos
      user: 'root',       // Usuario de la base de datos
      password: 'password', // Contraseña de la base de datos
      database: 'catsdb',  // Nombre de tu base de datos
      waitForConnections: true,
      connectionLimit: 10,  // Limita el número de conexiones
      queueLimit: 0,
    });
  }

  // Método para ejecutar queries SQL directamente
  async query(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, params, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  // Método para cerrar la conexión (aunque con el pool no es necesario normalmente)
  closeConnection() {
    this.connection.end();
  }
}
```

#### Explicación:
- **Pool de conexiones**: En lugar de crear una nueva conexión cada vez, se utiliza un **pool de conexiones** para mejorar el rendimiento y la eficiencia de las consultas, especialmente si la aplicación realiza muchas.
- **Método `query`**: Ejecuta una consulta SQL y devuelve los resultados.
- **`closeConnection`**: Aunque el pool maneja la conexión, este método puede cerrarla cuando ya no sea necesario.

### **Paso 3: Crear Módulo para el Servicio de Base de Datos**

Ahora, vamos a crear un módulo para el servicio de base de datos. Este módulo se importará en otros módulos que necesiten acceso a la base de datos.

#### Crear `database.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],  // Hacemos que DatabaseService esté disponible para otros módulos
})
export class DatabaseModule {}
```

### **Paso 4: Crear Módulos y Servicios que Usarán la Base de Datos**

Ahora crearemos dos módulos adicionales que usarán la conexión a la base de datos: uno para manejar los gatos (`CatsModule`) y otro para manejar las personas (`PeopleModule`).

#### Crear `cats.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CatsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Obtener todos los gatos
  async findAll() {
    const sql = 'SELECT * FROM cats';
    return await this.databaseService.query(sql);
  }

  // Agregar un gato
  async addCat(name: string, age: number) {
    const sql = 'INSERT INTO cats (name, age) VALUES (?, ?)';
    const params = [name, age];
    return await this.databaseService.query(sql, params);
  }
}
```

#### Crear `cats.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [CatsService],
  exports: [CatsService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class CatsModule {}
```

#### Crear `people.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PeopleService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Obtener todas las personas
  async findAll() {
    const sql = 'SELECT * FROM people';
    return await this.databaseService.query(sql);
  }

  // Agregar una persona
  async addPerson(name: string, age: number) {
    const sql = 'INSERT INTO people (name, age) VALUES (?, ?)';
    const params = [name, age];
    return await this.databaseService.query(sql, params);
  }
}
```

#### Crear `people.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [PeopleService],
  exports: [PeopleService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class PeopleModule {}
```

### **Paso 5: Modificar `app.module.ts`**

En el `AppModule`, necesitamos importar tanto el módulo de base de datos como los módulos `CatsModule` y `PeopleModule`.

#### Modificar `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { PeopleModule } from './people/people.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CatsModule, PeopleModule],  // Importamos todos los módulos necesarios
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### **Paso 6: Probar la Aplicación**

Ahora que tienes la estructura lista, puedes ejecutar la aplicación y probar las rutas para **gatos** y **personas**. Asegúrate de tener las tablas correspondientes en tu base de datos.

Ejecuta la aplicación:

```bash
npm run start
```

Prueba las siguientes rutas en tu navegador o usando una herramienta como Postman:

- **Obtener todos los gatos**:
  - `GET http://localhost:3000/cats`
- **Agregar un gato**:
  - `POST http://localhost:3000/cats/add`
- **Obtener todas las personas**:
  - `GET http://localhost:3000/people`
- **Agregar una persona**:
  - `POST http://localhost:3000/people/add`

---

### **Resumen**

En este ejemplo ampliado, se han realizado los siguientes pasos:

1. **Servicio de base de datos compartido** (`DatabaseService`): Centraliza la lógica de conexión y ejecución de consultas SQL.
2. **Módulo de base de datos** (`DatabaseModule`): Hacemos disponible el servicio de base de datos en otros módulos mediante el uso de `exports`.
3. **Servicios y módulos independientes** (`CatsService` y `PeopleService`): Estos servicios pueden interactuar con la base de datos utilizando el servicio compartido `DatabaseService`.
4. **Inyección de dependencias**: Los servicios de `CatsModule` y `PeopleModule` pueden usar `DatabaseService` para ejecutar consultas SQL.

Con esta estructura, puedes fácilmente agregar más módulos y servicios que interactúan con la base de datos, manteniendo la arquitectura modular y organizada en NestJS.