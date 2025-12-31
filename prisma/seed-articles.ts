import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding articles...");

  // Article 1: Golf Simulator Basics
  await prisma.article.upsert({
    where: { slug: "golf-simulator-basics-components-how-they-work" },
    update: {},
    create: {
      title: "Golf Simulator Basics: The Components and How They Work Together",
      slug: "golf-simulator-basics-components-how-they-work",
      excerpt: "Understanding the six core components of a golf simulator and how they work together to create an accurate, immersive experience for GSPro and other platforms.",
      category: "START_HERE",
      readTime: "8 min read",
      published: true,
      featured: true,
      order: 1,
      publishedAt: new Date(),
      content: `
        <h2>What a Golf Simulator Is, in Plain Language</h2>
        <p>A golf simulator is a system that measures your shot and turns it into ball flight on a virtual range or course. The "feel" and accuracy of a sim comes from how well the measurement device, hitting environment, and display all work together.</p>

        <p>For GSPro users, this means having hardware that accurately captures your swing data and a setup that creates an immersive, realistic playing environment.</p>

        <h2>The Six Core Components</h2>

        <h3>1. Launch Monitor</h3>
        <p>Measures club and ball data (varies by technology). This is your accuracy foundation. Whether you choose radar-based (like Trackman, Foresight GCQuad), photometric (like SkyTrak, Bushnell Launch Pro), or camera-based systems, the launch monitor is what captures your swing data and sends it to GSPro.</p>

        <h3>2. Impact Screen or Net</h3>
        <p>Safely stops the ball. Screens double as your display surface. A quality impact screen absorbs the ball's energy, reduces bounce-back, and provides a smooth projection surface for your visuals. This is critical for both safety and image quality.</p>

        <h3>3. Projector or TV</h3>
        <p>Shows the virtual environment. Projector is the classic immersive setup. For GSPro's detailed course graphics, you'll want at least 1080p resolution, though 4K provides stunning clarity. The projector needs to be positioned to avoid shadows from your swing.</p>

        <h3>4. Computer and Software</h3>
        <p>Renders graphics, processes data, runs courses, practice modes, and online play. GSPro is demanding software that requires a capable gaming PC. Your computer needs to handle real-time physics calculations, high-quality 3D graphics, and seamless communication with your launch monitor.</p>

        <h3>5. Hitting Mat + Stance Surface</h3>
        <p>Determines injury risk and realism. The wrong mat can ruin the experience. A good hitting mat protects your joints during long practice sessions while providing realistic feedback. Many serious sim users invest in mats with replaceable hitting strips.</p>

        <h3>6. Enclosure and Protection</h3>
        <p>Contains mishits, reduces bouncebacks, improves safety and noise. Even good golfers hit the occasional shank. A proper enclosure with side netting and padding protects your room, your equipment, and anyone nearby.</p>

        <h2>A Simple "Build Order" That Prevents Mistakes</h2>
        <ol>
          <li><strong>Measure your room and define a safe hitting zone</strong> - Know your space constraints before buying anything</li>
          <li><strong>Pick launch monitor style that fits the space</strong> - Radar vs camera vs photometric each have different space requirements</li>
          <li><strong>Choose screen size and enclosure depth</strong> - Based on your room dimensions and hitting distance</li>
          <li><strong>Choose projector based on throw distance and screen size</strong> - Calculate the throw ratio you need</li>
          <li><strong>Build floor and mat transitions</strong> - Create a level, stable hitting platform</li>
          <li><strong>Finalize PC and cables</strong> - Ensure your computer can run GSPro smoothly</li>
          <li><strong>Tune: alignment, lighting, screen tension, projector focus</strong> - Fine-tune for optimal performance</li>
        </ol>

        <h2>The Three Things That Matter Most</h2>
        <ul>
          <li><strong>Space and safety geometry</strong> - Ceiling height, offsets, distance to screen. If you don't have adequate space, no amount of expensive equipment will make your simulator safe or comfortable.</li>
          <li><strong>Launch monitor compatibility with your room</strong> - Especially lighting and depth. Some launch monitors require specific lighting conditions or minimum distances that your space might not accommodate.</li>
          <li><strong>Mat and flooring comfort</strong> - Long sessions should not hurt. GSPro is so engaging that you'll want to play for hours. Joint pain from a poor mat will cut your sessions short.</li>
        </ul>

        <h2>Common Misconceptions</h2>

        <h3>"I can fix a bad screen image with keystone"</h3>
        <p>Keystone is a last resort and usually reduces clarity. Digital keystone correction works by cropping and stretching the image, which reduces effective resolution. Always mount your projector square to the screen.</p>

        <h3>"Brighter is always better"</h3>
        <p>Brightness helps, but placement, focus, and screen material matter too. A well-positioned 2000-lumen projector with a good screen can look better than a poorly-placed 3500-lumen unit.</p>

        <h3>"All mats are the same"</h3>
        <p>Many mats feel okay for 20 swings and cause pain after 200. The turf surface, backing material, and thickness all affect how the mat feels and performs. Budget mats often use hard rubber that jars your joints.</p>

        <h2>Quick Checklist Before Buying Anything</h2>
        <ul>
          <li>☐ Ceiling height and where your club will actually swing</li>
          <li>☐ Minimum safe distance from hitter to screen (usually 8-10 feet)</li>
          <li>☐ Available projector throw distance</li>
          <li>☐ Power outlets and cable routes</li>
          <li>☐ Who will use it (lefty/righty, kids, guests)</li>
          <li>☐ Budget for the complete system, not just one component</li>
          <li>☐ GSPro computer requirements for your desired graphics settings</li>
        </ul>

        <h2>Next Steps</h2>
        <p>Ready to move forward? Start with space planning to understand your room's constraints, then dive into launch monitor selection. Every other decision flows from these two foundational choices.</p>
      `,
    },
  });

  // Article 2: Space Planning
  await prisma.article.upsert({
    where: { slug: "how-much-space-you-need-room-size-ceiling-height" },
    update: {},
    create: {
      title: "How Much Space You Really Need (Room Size, Ceiling Height, Offsets)",
      slug: "how-much-space-you-need-room-size-ceiling-height",
      excerpt: "Understanding the real space requirements for a golf simulator, including ceiling height, room width, depth constraints, and how to work with imperfect rooms.",
      category: "START_HERE",
      readTime: "10 min read",
      published: true,
      featured: true,
      order: 2,
      publishedAt: new Date(),
      ceilingHeight: "NINE_TO_TEN",
      content: `
        <h2>The Goal: Safe Swings and Clean Reads</h2>
        <p>You want enough space to swing freely, avoid ceiling strikes, and place the launch monitor where it reads consistently. For GSPro, this also means having adequate room for the visuals to create proper immersion.</p>

        <h2>Ceiling Height Realities</h2>
        <p>Many golfers can swing in 9 ft, but it depends on height and swing plane. If you're 6'2" with an upright swing, 9 feet might feel cramped. If you're 5'8" with a flatter swing, 9 feet could be fine.</p>

        <p><strong>10 ft is more comfortable for a wider range of users.</strong> This gives breathing room for taller golfers and those with steeper swings. It also provides a psychological comfort that encourages full, uninhibited swings.</p>

        <p>If your ceiling is borderline, plan for a slightly forward ball position and test with your longest club carefully. Some builders dig down their flooring or create a raised tee area to gain effective ceiling height.</p>

        <h3>Ceiling Height by User</h3>
        <ul>
          <li><strong>Under 5'8" with flat swing:</strong> 9 ft minimum</li>
          <li><strong>5'8" to 6'0" average swing:</strong> 9.5 ft comfortable, 10 ft ideal</li>
          <li><strong>Over 6'0" or upright swing:</strong> 10 ft minimum, 11 ft preferred</li>
        </ul>

        <h2>Room Width and the "Center Line" Problem</h2>
        <p>If you can build perfectly centered, great. Your hitting area is in the middle of the screen, everything is symmetrical, and alignment is straightforward.</p>

        <p>If not, build an offset bay:</p>
        <ul>
          <li>You hit slightly left or right of center to fit the room</li>
          <li>The screen and projector image stay centered</li>
          <li>Your software alignment must match your hitting line</li>
          <li>You need extra side protection on the "miss side"</li>
        </ul>

        <h3>Minimum Width Guidelines</h3>
        <ul>
          <li><strong>Centered hitting bay:</strong> 12-14 ft minimum (allows for full swing and some mishits)</li>
          <li><strong>Offset hitting bay:</strong> 10-12 ft minimum (tighter but workable)</li>
          <li><strong>Comfortable width:</strong> 15-16 ft (provides buffer zone for hooks and slices)</li>
        </ul>

        <h2>Depth: The Hidden Constraint</h2>
        <p>Depth is eaten up by several critical zones:</p>

        <h3>Space Behind Screen</h3>
        <p>For ball absorption and tensioning: 12-18 inches minimum. Impact screens need room to flex when hit. This buffer zone also protects your wall from damage.</p>

        <h3>Ball to Screen Distance</h3>
        <p>Safety and comfort: 8-10 feet minimum. Closer than 8 feet feels cramped and increases ricochet risk. Some golfers prefer 10-12 feet for a more natural feel. This also affects your projector placement and throw distance calculations.</p>

        <h3>Behind the Golfer</h3>
        <p>Backswing clearance and walking space: 4-6 feet minimum. You need room to step back from the ball, take practice swings, and move around comfortably. If you plan to have others watch, add another 2-3 feet.</p>

        <h3>Total Depth Calculation</h3>
        <p>Minimum total: 12-14 feet (tight but workable)<br>
        Comfortable total: 16-18 feet (allows natural movement)<br>
        Ideal total: 18-20+ feet (plenty of space for everything)</p>

        <h2>A Practical Layout Recipe</h2>

        <h3>Step 1: Mark the Screen Plane First</h3>
        <p>Using tape or chalk, mark where the front of your impact screen will be. This is your reference point for everything else.</p>

        <h3>Step 2: Test Your Swing</h3>
        <p>Stand where you will hit and take slow practice swings with your driver. Check for:</p>
        <ul>
          <li>Ceiling clearance at the top of your backswing</li>
          <li>Wall clearance on your follow-through</li>
          <li>Adequate space behind you for your takeaway</li>
        </ul>

        <h3>Step 3: Mark Your Hitting Position</h3>
        <p>Once you've confirmed comfortable swings, mark exactly where your feet will be. This determines:</p>
        <ul>
          <li>Ball-to-screen distance</li>
          <li>Launch monitor placement (varies by model)</li>
          <li>Mat positioning</li>
        </ul>

        <h3>Step 4: Confirm Safety Zones</h3>
        <ul>
          <li>Ball-to-screen distance is comfortable (not cramped)</li>
          <li>Your follow-through does not drift into side wall zones</li>
          <li>You can place your launch monitor correctly (depending on model type)</li>
        </ul>

        <h2>Safety Zones You Should Not Skip</h2>

        <h3>Side Protection</h3>
        <p>For push slices and pull hooks: Add netting or padding on the sides, extending at least 3 feet beyond the screen edges. Even scratch golfers occasionally shank one.</p>

        <h3>Ceiling Padding</h3>
        <p>In the high-risk strike zone near the screen: If your ceiling is borderline, add foam padding in the area directly above your hitting position and extending toward the screen.</p>

        <h3>No Hard Surfaces</h3>
        <p>A clean zone in the ball flight path: Remove or pad any hard objects, furniture, or fixtures in the hitting zone and ball flight path.</p>

        <h2>What to Do with Imperfect Rooms</h2>

        <h3>Low Ceiling (Under 9 ft)</h3>
        <ul>
          <li>Consider digging down the floor (if basement)</li>
          <li>Use shorter clubs for practice</li>
          <li>Build a raised tee area at one end</li>
          <li>Accept that driver might not be possible</li>
        </ul>

        <h3>Narrow Width</h3>
        <ul>
          <li>Use an offset hitting position</li>
          <li>Maximize side netting on the "miss side"</li>
          <li>Consider a narrower screen (10-12 ft instead of 12-14 ft)</li>
        </ul>

        <h3>Limited Depth</h3>
        <ul>
          <li>Choose launch monitor tech that tolerates your constraints (some need more space)</li>
          <li>Minimize behind-screen buffer if wall is protected</li>
          <li>Accept closer ball-to-screen distance (8 ft vs 10 ft)</li>
        </ul>

        <h3>Irregular Shape</h3>
        <ul>
          <li>Build your hitting zone in the most spacious area</li>
          <li>Use the irregular space for seating, storage, or PC area</li>
          <li>Scale screen size to protect the room instead of forcing a huge screen</li>
        </ul>

        <h2>Quick Space Checklist</h2>
        <ul>
          <li>☐ Ceiling height: _______ ft (measure with driver at top of swing)</li>
          <li>☐ Width: _______ ft (measure wall to wall at hitting area)</li>
          <li>☐ Depth: _______ ft (measure from back wall to screen wall)</li>
          <li>☐ Obstructions: lights, vents, fixtures (mark locations)</li>
          <li>☐ Power access: outlets within 15 ft of hitting area</li>
          <li>☐ Offset or centered: (determined by room shape)</li>
        </ul>

        <h2>Next Steps</h2>
        <p>With your space measured and planned, you're ready to choose a launch monitor that fits your room's constraints. Different technologies have different space requirements and lighting needs.</p>
      `,
    },
  });

  // Article 3: Projector 101
  await prisma.article.upsert({
    where: { slug: "projector-101-throw-ratio-brightness-resolution" },
    update: {},
    create: {
      title: "Projector 101 for Golf Sims: Throw Ratio, Brightness, and Resolution",
      slug: "projector-101-throw-ratio-brightness-resolution",
      excerpt: "Understanding projector specifications, throw ratios, mounting positions, and what actually matters for displaying GSPro's beautiful course graphics.",
      category: "PROJECTORS",
      readTime: "12 min read",
      published: true,
      featured: true,
      order: 11,
      publishedAt: new Date(),
      content: `
        <h2>Start With This Question: How Far Can the Projector Be From the Screen?</h2>
        <p>That distance plus your desired screen width determines the throw ratio you need. This is the single most important calculation when choosing a projector for your golf simulator.</p>

        <p>For GSPro users, getting this right means crisp, immersive course visuals that enhance your playing experience rather than distract from it.</p>

        <h2>Throw Ratio, Explained Simply</h2>
        <p><strong>Throw ratio = distance from lens to screen ÷ image width</strong></p>

        <p>Lower throw ratio means you can get a big image from closer up (short throw). Higher throw ratio means you need more distance for the same image size.</p>

        <h3>Example Calculation</h3>
        <p>If you want a 12-foot wide image and your projector can be 10 feet from the screen:</p>
        <p>Throw ratio = 10 ft ÷ 12 ft = 0.83</p>
        <p>You need a projector with a throw ratio of about 0.8-0.9 (short throw range)</p>

        <h2>Why This Matters in Golf Sims</h2>
        <p>You do not want the projector behind the golfer casting shadows. The ideal position is ceiling-mounted, ahead of the golfer but behind the ball position. This keeps shadows off the screen and the projector safe from club strikes.</p>

        <h3>Typical Golf Sim Mounting Positions</h3>
        <ul>
          <li><strong>Ceiling mount, 3-5 feet behind ball:</strong> Requires short throw (0.8-1.2 ratio)</li>
          <li><strong>Ceiling mount, 6-8 feet behind ball:</strong> Can use standard throw (1.2-1.5 ratio)</li>
          <li><strong>Shelf/wall mount close to screen:</strong> Requires ultra short throw (0.25-0.5 ratio)</li>
        </ul>

        <h2>Short Throw vs Ultra Short Throw</h2>

        <h3>Short Throw (0.8-1.3 ratio)</h3>
        <p>Common for sims. Usually ceiling mounted, ahead of the golfer. This is the sweet spot for most golf simulator builds.</p>

        <p><strong>Advantages:</strong></p>
        <ul>
          <li>Flexible positioning</li>
          <li>Easier to align and focus</li>
          <li>More affordable options</li>
          <li>Good image quality</li>
        </ul>

        <p><strong>Popular models:</strong> BenQ TH685P, Optoma GT1080HDR, Epson Home Cinema series</p>

        <h3>Ultra Short Throw (0.25-0.5 ratio)</h3>
        <p>Sits very close to the screen. Can work, but needs careful mounting and protection. These are often used when ceiling mounting isn't possible.</p>

        <p><strong>Advantages:</strong></p>
        <ul>
          <li>Minimal space behind golfer</li>
          <li>No shadow issues</li>
          <li>Can work in very tight spaces</li>
        </ul>

        <p><strong>Challenges:</strong></p>
        <ul>
          <li>More expensive</li>
          <li>Needs precise alignment</li>
          <li>Vulnerable to ball strikes without protection</li>
          <li>Limited lens adjustment</li>
        </ul>

        <h2>Brightness (Lumens): What You're Really Buying</h2>
        <p>Brightness is about overcoming room light and maintaining punch on a big surface. For GSPro's detailed course graphics, you want enough brightness to see shadows, texture, and color depth.</p>

        <h3>Brightness Guidelines for Golf Sims</h3>
        <ul>
          <li><strong>2000-2500 lumens:</strong> Dark room only, but excellent contrast and color</li>
          <li><strong>2500-3000 lumens:</strong> Controlled lighting, good for basements with minimal ambient light</li>
          <li><strong>3000-3500 lumens:</strong> Can handle some ambient light, good for garage setups</li>
          <li><strong>3500+ lumens:</strong> Bright rooms or large screens (14+ feet)</li>
        </ul>

        <p><strong>Important:</strong> Screens, enclosures, and ambient light will change how "bright" it looks. A 3000-lumen projector with a high-gain screen can look brighter than a 3500-lumen projector with a low-gain screen.</p>

        <h2>Resolution and Why 1080p Can Still Be Great</h2>

        <h3>1080p (1920x1080)</h3>
        <p>Often a sweet spot for cost and performance. For most golfers, 1080p provides plenty of detail for enjoying GSPro's courses. You can see break on greens, read distances, and enjoy the scenery without breaking the bank.</p>

        <h3>4K (3840x2160)</h3>
        <p>Looks excellent but costs more and may push your PC requirements higher. If your computer can handle GSPro at 4K and you have the budget, the extra clarity is noticeable, especially on larger screens (13+ feet).</p>

        <h3>Practical Advice</h3>
        <p>For many builds, sharp focus and proper alignment beat raw resolution. A perfectly aligned 1080p projector with good focus looks better than a misaligned 4K unit.</p>

        <h2>Refresh Rate and Latency</h2>
        <p>For golf sims, you want responsiveness that feels immediate. When you make contact, you should see the ball launch without perceptible delay.</p>

        <h3>What to Look For</h3>
        <ul>
          <li><strong>Refresh rate:</strong> 60Hz minimum, 120Hz is nice for smoother motion</li>
          <li><strong>Input lag:</strong> Under 50ms is good, under 30ms is excellent</li>
          <li><strong>Gaming mode:</strong> Most modern projectors have this, which reduces processing lag</li>
        </ul>

        <p>If you are sensitive to delay, prioritize low input lag and stable frame rate over max resolution. GSPro benefits more from smooth, responsive visuals than from ultra-high resolution with lag.</p>

        <h2>Keystone: The Trap</h2>
        <p>Digital keystone reduces effective resolution and can introduce blur. Keystone correction works by cropping and digitally warping the image, which degrades quality.</p>

        <h3>Instead, Aim For:</h3>
        <ul>
          <li>A square mount (projector perpendicular to screen)</li>
          <li>A projector centered to the screen plane</li>
          <li>Minimal correction (use lens shift if available)</li>
        </ul>

        <p>Some projectors have optical lens shift, which is far better than digital keystone. Lens shift moves the lens physically without cropping the image.</p>

        <h2>Mounting Tips That Save Headaches</h2>

        <h3>Use a Solid Ceiling Mount and Lock It Down</h3>
        <p>Vibration and settling will shift your image over time. Use a quality mount with secure ceiling attachment. In simulator rooms with potential vibration (from ball impacts), extra stability matters.</p>

        <h3>Plan Cable Routes Before the Mount Goes Up</h3>
        <p>HDMI from PC to projector, power to projector. Use cable management to keep wires tidy and protected. Consider using an HDMI over Ethernet extender if you're running long distances (over 25 feet).</p>

        <h3>Leave Access to Focus and Zoom Controls</h3>
        <p>You will need to adjust these. Don't mount the projector where you can't reach the controls without a ladder and acrobatics. Remote controls can be lost; physical access is valuable.</p>

        <h3>Add a Physical "Bump Guard"</h3>
        <p>If your space is tight, add padding or a cage around the projector. A wayward club or hands thrown up in frustration can damage an exposed projector.</p>

        <h2>Screen Compatibility</h2>
        <p>Your projector and screen work together. Key considerations:</p>
        <ul>
          <li><strong>Screen gain:</strong> Higher gain reflects more light but narrows viewing angle</li>
          <li><strong>Screen size:</strong> Bigger screens need more lumens</li>
          <li><strong>Screen material:</strong> Some materials handle hotspotting better than others</li>
          <li><strong>Ambient light:</strong> Brighter rooms need higher gain screens or brighter projectors</li>
        </ul>

        <h2>Quick Projector Checklist</h2>
        <ul>
          <li>☐ Measure throw distance (projector to screen): _______ feet</li>
          <li>☐ Desired screen width: _______ feet</li>
          <li>☐ Calculate throw ratio needed: _______ (distance ÷ width)</li>
          <li>☐ Room lighting conditions: Dark / Dim / Ambient</li>
          <li>☐ Budget range: $ _______</li>
          <li>☐ Resolution preference: 1080p / 4K</li>
          <li>☐ Mounting location identified: Yes / No</li>
          <li>☐ Cable route planned: Yes / No</li>
        </ul>

        <h2>Popular Projectors for Golf Sims (2025)</h2>

        <h3>Budget (Under $800)</h3>
        <ul>
          <li><strong>BenQ TH585P:</strong> 3600 lumens, 1080p, low input lag</li>
          <li><strong>Optoma HD146X:</strong> 3600 lumens, 1080p, good brightness</li>
        </ul>

        <h3>Mid-Range ($800-$1500)</h3>
        <ul>
          <li><strong>BenQ TH685P:</strong> 3500 lumens, 1080p, excellent gaming mode</li>
          <li><strong>Optoma GT1080HDR:</strong> 3800 lumens, short throw, HDR support</li>
          <li><strong>Epson Home Cinema 3800:</strong> 3000 lumens, 4K, great color</li>
        </ul>

        <h3>Premium ($1500+)</h3>
        <ul>
          <li><strong>BenQ LK936ST:</strong> 5100 lumens, 4K, laser light source</li>
          <li><strong>Epson LS12000:</strong> 2700 lumens, 4K, laser, exceptional image quality</li>
        </ul>

        <h2>Next Steps</h2>
        <p>With your projector selected, you'll need to consider screen material, mounting systems, and how everything integrates with your enclosure. The projector and screen work as a system, so plan them together.</p>
      `,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
