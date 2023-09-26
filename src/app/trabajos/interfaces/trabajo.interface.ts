export interface Trabajo {
    id : string,
    empresaId : string,
    empresaNombre : string,
    noEspecificarEmpresa : boolean,
    alternativaNombre : string | null;
    puestoTrabajo : string,
    ciudad : string,
    provincia : string,
    tipoTrabajoId : string, 
    areaTrabajoId : string,
    descripcionPuesto : string,
    tipoHorario : string, 
    diasLaborales1 : DiaLaboral[] | null,
    horarioTrabajo1 : string | null,
    horario1desde : string | null,
    horario1hasta : string | null,
    horario1desdecortado : string | null,
    horario1hastacortado : string | null,
    diasLaborales2 : DiaLaboral[] | null,
    horarioTrabajo2 : string | null,
    horario2desde : string | null,
    horario2hasta : string | null,
    horario2desdecortado : string | null,
    horario2hastacortado : string | null,
    diasLaborales3 : DiaLaboral[] | null,
    horarioTrabajo3 : string | null,
    horario3desde : string | null,
    horario3hasta : string | null,
    horario3desdecortado : string | null,
    horario3hastacortado : string | null,
    //indicarRemuneracion : boolean, 
    tipoRemuneracion : string | null,
    remuneracionMinima : string | null,
    remuneracionMaxima : string | null,
    genero : string,
    edadMinima : number,
    edadMaxima : number | null,
    nivelEstudioMinimo : string,
    estadoEstudios : string,
    areasEstudio : string | null,
    experienciasLaboralesPrevias : string, 
    idUsuario : string,
    fechaCreacion : any,
    fechaVencimiento : any,
    postulantes : Array <string> | null;
    pagado : boolean;
  }

  export interface DiaLaboral{
    nombre : string | null;
    selected: boolean | null;
    value: number | null;
  }