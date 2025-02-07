


export class Response {
  constructor(firstPhaseResponses, secondPhaseResponses) {
    this.firstPhaseResponses = firstPhaseResponses.map(
      (fp) => new PhaseResponse(fp)
    );
    this.secondPhaseResponses = secondPhaseResponses.map(
      (sp) => new PhaseResponse(sp)
    );
  }
}

export class PhaseResponse {
  constructor({ tableau, z, cx, cj }) {
    this.tableau = tableau;
    this.z = z;
    this.cx = cx;
    this.cj = cj;
  }
}

// Simulación de tu JSON (usa tu JSON real aquí)
//const jsonData
//hzo-jgsx-jkw
